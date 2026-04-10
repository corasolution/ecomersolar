<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Category;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;
    protected static ?string $navigationIcon = 'heroicon-o-sun';
    protected static ?string $navigationGroup = 'Catalog';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Basic Info')->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn($state, callable $set) => $set('slug', Str::slug($state))),
                Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true),
                Forms\Components\Select::make('category_id')
                    ->label('Category')
                    ->options(Category::pluck('name', 'id'))
                    ->required(),
                Forms\Components\TextInput::make('sku'),
                Forms\Components\TextInput::make('brand'),
                Forms\Components\TextInput::make('wattage')->placeholder('e.g. 550W'),
            ])->columns(2),

            Forms\Components\Section::make('Description')->schema([
                Forms\Components\Textarea::make('short_description')->rows(2),
                Forms\Components\RichEditor::make('description')->columnSpanFull(),
            ]),

            Forms\Components\Section::make('Pricing & Stock')->schema([
                Forms\Components\TextInput::make('price')->numeric()->prefix('$')->required(),
                Forms\Components\TextInput::make('sale_price')->numeric()->prefix('$'),
                Forms\Components\TextInput::make('stock_qty')->numeric()->default(0)->required(),
                Forms\Components\TextInput::make('warranty_years')->numeric()->default(1),
            ])->columns(2),

            Forms\Components\Section::make('Media & Specs')->schema([
                Forms\Components\FileUpload::make('images')
                    ->multiple()
                    ->image()
                    ->directory('products')
                    ->columnSpanFull(),
                Forms\Components\KeyValue::make('specifications')
                    ->reorderable()
                    ->columnSpanFull(),
            ]),

            Forms\Components\Section::make('Status')->schema([
                Forms\Components\Toggle::make('is_active')->default(true),
                Forms\Components\Toggle::make('is_featured')->default(false),
                Forms\Components\TextInput::make('sort_order')->numeric()->default(0),
            ])->columns(3),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable()->sortable()->limit(30),
                Tables\Columns\TextColumn::make('category.name')->label('Category')->badge(),
                Tables\Columns\TextColumn::make('price')->money('USD')->sortable(),
                Tables\Columns\TextColumn::make('sale_price')->money('USD')->label('Sale Price'),
                Tables\Columns\TextColumn::make('stock_qty')->sortable()->label('Stock'),
                Tables\Columns\IconColumn::make('is_active')->boolean()->label('Active'),
                Tables\Columns\IconColumn::make('is_featured')->boolean()->label('Featured'),
                Tables\Columns\TextColumn::make('created_at')->dateTime('M d, Y')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                    ->relationship('category', 'name'),
                Tables\Filters\TernaryFilter::make('is_active'),
                Tables\Filters\TernaryFilter::make('is_featured'),
            ])
            ->actions([Tables\Actions\EditAction::make()])
            ->bulkActions([Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit'   => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
