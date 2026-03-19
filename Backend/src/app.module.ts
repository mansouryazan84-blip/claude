import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { InventoryModule } from './inventory/inventory.module';
import { TransfersModule } from './transfers/transfers.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { ContactsModule } from './contacts/contacts.module';
import { PurchasesModule } from './purchases/purchases.module';
import { SalesModule } from './sales/sales.module';
import { EmployeesModule } from './employees/employees.module';
import { FleetModule } from './fleet/fleet.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { User } from './users/user.entity';
import { Item } from './items/item.entity';
import { ItemCategory } from './items/item-category.entity';
import { UnitConversion } from './items/unit-conversion.entity';
import { Warehouse } from './warehouses/warehouse.entity';
import { WarehouseStock } from './inventory/warehouse-stock.entity';
import { StockMovement } from './inventory/stock-movement.entity';
import { Contact } from './contacts/contact.entity';
import { PurchaseOrder, PurchaseOrderLine } from './purchases/purchase-order.entity';
import { SalesOrder, SalesOrderLine } from './sales/sales-order.entity';
import { Employee } from './employees/employee.entity';
import { Vehicle } from './fleet/vehicle.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || '193.203.184.199',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'u998106817_WHS',
      password: process.env.DB_PASSWORD || 'Optimum2026@',
      database: process.env.DB_NAME || 'u998106817_WHS',
      entities: [
        User, Item, ItemCategory, UnitConversion,
        Warehouse, WarehouseStock, StockMovement,
        Contact,
        PurchaseOrder, PurchaseOrderLine,
        SalesOrder, SalesOrderLine,
        Employee, Vehicle,
      ],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
      charset: 'utf8mb4',
      timezone: '+03:00',
      extra: {
        connectionLimit: 10,
        connectTimeout: 30000,
      },
    }),

    AuthModule,
    ItemsModule,
    InventoryModule,
    TransfersModule,
    WarehousesModule,
    ContactsModule,
    PurchasesModule,
    SalesModule,
    EmployeesModule,
    FleetModule,
    DashboardModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
  ],
})
export class AppModule {}
