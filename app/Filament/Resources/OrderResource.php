<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Mail\OrderPaidMail;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Mail;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;
    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';
    protected static ?string $navigationGroup = 'Orders';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Customer Info')->schema([
                Forms\Components\TextInput::make('customer_name')->disabled(),
                Forms\Components\TextInput::make('customer_email')->disabled(),
                Forms\Components\TextInput::make('customer_phone')->disabled(),
                Forms\Components\TextInput::make('province')->disabled(),
                Forms\Components\Textarea::make('street_address')->disabled()->columnSpanFull(),
            ])->columns(2),

            Forms\Components\Section::make('Order Status')->schema([
                Forms\Components\Select::make('order_status')
                    ->options([
                        'new' => 'New',
                        'confirmed' => 'Confirmed',
                        'processing' => 'Processing',
                        'shipped' => 'Shipped',
                        'delivered' => 'Delivered',
                        'cancelled' => 'Cancelled',
                    ]),
                Forms\Components\Select::make('payment_status')
                    ->options([
                        'pending' => 'Pending',
                        'paid' => 'Paid',
                        'failed' => 'Failed',
                    ]),
                Forms\Components\TextInput::make('aba_transaction_id')->label('ABA Transaction ID'),
            ])->columns(3),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_number')->searchable()->copyable()->weight('bold'),
                Tables\Columns\TextColumn::make('customer_name')->searchable(),
                Tables\Columns\TextColumn::make('customer_email')->searchable()->toggleable(),
                Tables\Columns\TextColumn::make('total')->money('USD')->sortable(),
                Tables\Columns\BadgeColumn::make('payment_status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'paid',
                        'danger'  => 'failed',
                    ]),
                Tables\Columns\BadgeColumn::make('order_status')
                    ->colors([
                        'primary' => 'new',
                        'success' => fn($state) => in_array($state, ['confirmed', 'delivered']),
                        'warning' => fn($state) => in_array($state, ['processing', 'shipped']),
                        'danger'  => 'cancelled',
                    ]),
                Tables\Columns\TextColumn::make('payment_method')->badge()->label('Payment'),
                Tables\Columns\TextColumn::make('created_at')->dateTime('M d, Y H:i')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('payment_status')
                    ->options(['pending' => 'Pending', 'paid' => 'Paid', 'failed' => 'Failed']),
                Tables\Filters\SelectFilter::make('order_status')
                    ->options(['new' => 'New', 'confirmed' => 'Confirmed', 'processing' => 'Processing', 'shipped' => 'Shipped', 'delivered' => 'Delivered']),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('mark_paid')
                    ->label('Mark as Paid')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn(Order $record) => $record->payment_status !== 'paid')
                    ->requiresConfirmation()
                    ->action(function (Order $record) {
                        $record->update([
                            'payment_status' => 'paid',
                            'order_status'   => 'confirmed',
                            'paid_at'        => now(),
                        ]);
                        Mail::to($record->customer_email)->queue(new OrderPaidMail($record));
                        Notification::make()->title('Order marked as paid')->success()->send();
                    }),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListOrders::route('/'),
            'edit'   => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
