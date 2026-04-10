<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceBookingResource\Pages;
use App\Models\ServiceBooking;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ServiceBookingResource extends Resource
{
    protected static ?string $model = ServiceBooking::class;
    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';
    protected static ?string $navigationGroup = 'Orders';
    protected static ?int $navigationSort = 2;
    protected static ?string $navigationLabel = 'Bookings';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('booking_reference')->disabled(),
            Forms\Components\Select::make('service_id')
                ->relationship('service', 'name')
                ->disabled(),
            Forms\Components\TextInput::make('customer_name')->disabled(),
            Forms\Components\TextInput::make('customer_email')->disabled(),
            Forms\Components\TextInput::make('customer_phone')->disabled(),
            Forms\Components\Textarea::make('installation_address')->disabled()->columnSpanFull(),
            Forms\Components\DatePicker::make('preferred_date')->disabled(),
            Forms\Components\TextInput::make('time_slot')->disabled(),
            Forms\Components\TextInput::make('system_size_kw')->disabled()->suffix('kW'),
            Forms\Components\TextInput::make('estimated_price')->disabled()->prefix('$'),
            Forms\Components\Select::make('status')
                ->options([
                    'pending'   => 'Pending',
                    'confirmed' => 'Confirmed',
                    'completed' => 'Completed',
                    'cancelled' => 'Cancelled',
                ]),
            Forms\Components\Textarea::make('additional_notes')->disabled()->columnSpanFull(),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('booking_reference')->searchable()->copyable(),
                Tables\Columns\TextColumn::make('service.name')->searchable()->label('Service'),
                Tables\Columns\TextColumn::make('customer_name')->searchable(),
                Tables\Columns\TextColumn::make('customer_phone'),
                Tables\Columns\TextColumn::make('preferred_date')->date('M d, Y')->sortable(),
                Tables\Columns\TextColumn::make('time_slot')->badge(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => fn($state) => in_array($state, ['confirmed', 'completed']),
                        'danger'  => 'cancelled',
                    ]),
                Tables\Columns\TextColumn::make('estimated_price')->money('USD'),
            ])
            ->defaultSort('preferred_date', 'asc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(['pending' => 'Pending', 'confirmed' => 'Confirmed', 'completed' => 'Completed', 'cancelled' => 'Cancelled']),
            ])
            ->actions([Tables\Actions\EditAction::make()])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListServiceBookings::route('/'),
            'edit'  => Pages\EditServiceBooking::route('/{record}/edit'),
        ];
    }
}
