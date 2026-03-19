-- ============================================================
-- WMS Database Migration
-- Database: u998106817_WHS
-- Run this once against your MySQL server
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ─── Users ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`           VARCHAR(36)  NOT NULL DEFAULT (UUID()),
  `name`         VARCHAR(100) NOT NULL,
  `email`        VARCHAR(150) NOT NULL,
  `password`     VARCHAR(255) NOT NULL,
  `role`         ENUM('admin','manager','operator','viewer') NOT NULL DEFAULT 'operator',
  `warehouse_id` VARCHAR(36)  NULL,
  `is_active`    TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Item Categories ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `item_categories` (
  `id`         VARCHAR(36)  NOT NULL DEFAULT (UUID()),
  `name_ar`    VARCHAR(100) NOT NULL,
  `name_en`    VARCHAR(100) NULL,
  `color`      VARCHAR(20)  NULL,
  `parent_id`  VARCHAR(36)  NULL,
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `item_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Items ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `items` (
  `id`               VARCHAR(36)   NOT NULL DEFAULT (UUID()),
  `sku`              VARCHAR(50)   NOT NULL,
  `barcode`          VARCHAR(50)   NULL,
  `name_ar`          VARCHAR(150)  NOT NULL,
  `name_en`          VARCHAR(150)  NULL,
  `category_id`      VARCHAR(36)   NOT NULL,
  `sub_category_id`  VARCHAR(36)   NULL,
  `brand`            VARCHAR(100)  NULL,
  `storage_type`     ENUM('dry','refrigerated','frozen','controlled') NOT NULL DEFAULT 'dry',
  `base_unit`        ENUM('kg','gram','ton','liter','ml','piece','box','carton','bag','pallet','barrel','can') NOT NULL DEFAULT 'piece',
  `weight_per_unit`  DECIMAL(10,3) NULL,
  `volume_per_unit`  DECIMAL(10,3) NULL,
  `shelf_life_days`  INT           NULL,
  `minimum_stock`    DECIMAL(12,3) NOT NULL DEFAULT 0,
  `maximum_stock`    DECIMAL(12,3) NULL,
  `reorder_point`    DECIMAL(12,3) NOT NULL DEFAULT 0,
  `is_batch_tracked` TINYINT(1)    NOT NULL DEFAULT 0,
  `is_serial_tracked`TINYINT(1)    NOT NULL DEFAULT 0,
  `tax_rate`         DECIMAL(5,2)  NULL,
  `status`           ENUM('active','discontinued','pending_approval') NOT NULL DEFAULT 'active',
  `notes`            TEXT          NULL,
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_items_sku` (`sku`),
  CONSTRAINT `FK_items_category`    FOREIGN KEY (`category_id`)     REFERENCES `item_categories`(`id`),
  CONSTRAINT `FK_items_subcategory` FOREIGN KEY (`sub_category_id`) REFERENCES `item_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Unit Conversions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `unit_conversions` (
  `id`        VARCHAR(36)   NOT NULL DEFAULT (UUID()),
  `item_id`   VARCHAR(36)   NOT NULL,
  `from_unit` VARCHAR(20)   NOT NULL,
  `to_unit`   VARCHAR(20)   NOT NULL,
  `factor`    DECIMAL(12,6) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_conversions_item` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Warehouses ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `warehouses` (
  `id`            VARCHAR(36)    NOT NULL DEFAULT (UUID()),
  `code`          VARCHAR(30)    NOT NULL,
  `name_ar`       VARCHAR(150)   NOT NULL,
  `name_en`       VARCHAR(150)   NULL,
  `type`          ENUM('main','branch','transit','cold_storage') NOT NULL DEFAULT 'branch',
  `address`       TEXT           NULL,
  `city`          VARCHAR(100)   NULL,
  `capacity`      DECIMAL(15,2)  NULL,
  `used_capacity` DECIMAL(15,2)  NOT NULL DEFAULT 0,
  `manager_id`    VARCHAR(36)    NULL,
  `manager_name`  VARCHAR(150)   NULL,
  `phone`         VARCHAR(30)    NULL,
  `is_active`     TINYINT(1)     NOT NULL DEFAULT 1,
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_warehouses_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Warehouse Stock ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `warehouse_stock` (
  `id`            VARCHAR(36)   NOT NULL DEFAULT (UUID()),
  `warehouse_id`  VARCHAR(36)   NOT NULL,
  `item_id`       VARCHAR(36)   NOT NULL,
  `quantity`      DECIMAL(15,3) NOT NULL DEFAULT 0,
  `location_code` VARCHAR(50)   NULL,
  `last_updated`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_stock_warehouse_item` (`warehouse_id`, `item_id`),
  CONSTRAINT `FK_stock_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`),
  CONSTRAINT `FK_stock_item`      FOREIGN KEY (`item_id`)      REFERENCES `items`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Stock Movements ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `stock_movements` (
  `id`                 VARCHAR(36)   NOT NULL DEFAULT (UUID()),
  `reference_no`       VARCHAR(50)   NOT NULL,
  `type`               ENUM('in','out','transfer','adjustment','return') NOT NULL,
  `status`             ENUM('pending','approved','in_transit','completed','cancelled') NOT NULL DEFAULT 'pending',
  `item_id`            VARCHAR(36)   NOT NULL,
  `from_warehouse_id`  VARCHAR(36)   NULL,
  `to_warehouse_id`    VARCHAR(36)   NULL,
  `quantity`           DECIMAL(15,3) NOT NULL,
  `unit`               VARCHAR(20)   NOT NULL,
  `batch_no`           VARCHAR(50)   NULL,
  `expiry_date`        DATE          NULL,
  `notes`              TEXT          NULL,
  `requested_by_id`    VARCHAR(36)   NOT NULL,
  `requested_by_name`  VARCHAR(150)  NOT NULL,
  `approved_by_id`     VARCHAR(36)   NULL,
  `approved_by_name`   VARCHAR(150)  NULL,
  `driver_name`        VARCHAR(150)  NULL,
  `vehicle_no`         VARCHAR(30)   NULL,
  `created_at`         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_movements_ref` (`reference_no`),
  CONSTRAINT `FK_movements_item`        FOREIGN KEY (`item_id`)           REFERENCES `items`(`id`),
  CONSTRAINT `FK_movements_from_wh`     FOREIGN KEY (`from_warehouse_id`) REFERENCES `warehouses`(`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_movements_to_wh`       FOREIGN KEY (`to_warehouse_id`)   REFERENCES `warehouses`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Contacts (Suppliers + Customers) ────────────────────────
CREATE TABLE IF NOT EXISTS `contacts` (
  `id`              VARCHAR(36)    NOT NULL DEFAULT (UUID()),
  `type`            ENUM('supplier','customer') NOT NULL,
  `code`            VARCHAR(30)    NOT NULL,
  `name_ar`         VARCHAR(200)   NOT NULL,
  `name_en`         VARCHAR(200)   NULL,
  `phone`           VARCHAR(30)    NOT NULL,
  `email`           VARCHAR(150)   NULL,
  `address`         TEXT           NULL,
  `city`            VARCHAR(100)   NULL,
  `tax_number`      VARCHAR(50)    NULL,
  `credit_limit`    DECIMAL(15,2)  NULL,
  `payment_terms`   INT            NULL COMMENT 'days',
  `is_active`       TINYINT(1)     NOT NULL DEFAULT 1,
  `balance`         DECIMAL(15,2)  NOT NULL DEFAULT 0,
  `total_purchases` DECIMAL(15,2)  NOT NULL DEFAULT 0,
  `total_sales`     DECIMAL(15,2)  NOT NULL DEFAULT 0,
  `created_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_contacts_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Purchase Orders ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `purchase_orders` (
  `id`               VARCHAR(36)   NOT NULL DEFAULT (UUID()),
  `order_no`         VARCHAR(50)   NOT NULL,
  `supplier_id`      VARCHAR(36)   NOT NULL,
  `warehouse_id`     VARCHAR(36)   NOT NULL,
  `status`           ENUM('draft','pending','approved','partial','completed','cancelled') NOT NULL DEFAULT 'draft',
  `order_date`       DATE          NOT NULL,
  `expected_date`    DATE          NULL,
  `subtotal`         DECIMAL(15,2) NOT NULL DEFAULT 0,
  `tax_total`        DECIMAL(15,2) NOT NULL DEFAULT 0,
  `discount_total`   DECIMAL(15,2) NOT NULL DEFAULT 0,
  `grand_total`      DECIMAL(15,2) NOT NULL DEFAULT 0,
  `notes`            TEXT          NULL,
  `created_by_id`    VARCHAR(36)   NOT NULL,
  `created_by_name`  VARCHAR(150)  NOT NULL,
  `created_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_po_order_no` (`order_no`),
  CONSTRAINT `FK_po_supplier`  FOREIGN KEY (`supplier_id`)  REFERENCES `contacts`(`id`),
  CONSTRAINT `FK_po_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `purchase_order_lines` (
  `id`           VARCHAR(36)   NOT NULL DEFAULT (UUID()),
  `order_id`     VARCHAR(36)   NOT NULL,
  `item_id`      VARCHAR(36)   NOT NULL,
  `item_name`    VARCHAR(200)  NOT NULL,
  `item_sku`     VARCHAR(50)   NOT NULL,
  `ordered_qty`  DECIMAL(12,3) NOT NULL,
  `received_qty` DECIMAL(12,3) NOT NULL DEFAULT 0,
  `unit`         VARCHAR(20)   NOT NULL,
  `unit_price`   DECIMAL(12,2) NOT NULL,
  `discount`     DECIMAL(5,2)  NOT NULL DEFAULT 0,
  `tax_rate`     DECIMAL(5,2)  NOT NULL DEFAULT 0,
  `total`        DECIMAL(15,2) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_pol_order` FOREIGN KEY (`order_id`) REFERENCES `purchase_orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Sales Orders ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `sales_orders` (
  `id`              VARCHAR(36)   NOT NULL DEFAULT (UUID()),
  `order_no`        VARCHAR(50)   NOT NULL,
  `customer_id`     VARCHAR(36)   NOT NULL,
  `warehouse_id`    VARCHAR(36)   NOT NULL,
  `status`          ENUM('draft','pending','approved','partial','completed','cancelled') NOT NULL DEFAULT 'draft',
  `order_date`      DATE          NOT NULL,
  `delivery_date`   DATE          NULL,
  `subtotal`        DECIMAL(15,2) NOT NULL DEFAULT 0,
  `tax_total`       DECIMAL(15,2) NOT NULL DEFAULT 0,
  `discount_total`  DECIMAL(15,2) NOT NULL DEFAULT 0,
  `grand_total`     DECIMAL(15,2) NOT NULL DEFAULT 0,
  `notes`           TEXT          NULL,
  `created_by_id`   VARCHAR(36)   NOT NULL,
  `created_by_name` VARCHAR(150)  NOT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_so_order_no` (`order_no`),
  CONSTRAINT `FK_so_customer`  FOREIGN KEY (`customer_id`)  REFERENCES `contacts`(`id`),
  CONSTRAINT `FK_so_warehouse` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sales_order_lines` (
  `id`        VARCHAR(36)   NOT NULL DEFAULT (UUID()),
  `order_id`  VARCHAR(36)   NOT NULL,
  `item_id`   VARCHAR(36)   NOT NULL,
  `item_name` VARCHAR(200)  NOT NULL,
  `item_sku`  VARCHAR(50)   NOT NULL,
  `qty`       DECIMAL(12,3) NOT NULL,
  `unit`      VARCHAR(20)   NOT NULL,
  `unit_price`DECIMAL(12,2) NOT NULL,
  `discount`  DECIMAL(5,2)  NOT NULL DEFAULT 0,
  `tax_rate`  DECIMAL(5,2)  NOT NULL DEFAULT 0,
  `total`     DECIMAL(15,2) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_sol_order` FOREIGN KEY (`order_id`) REFERENCES `sales_orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Employees ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `employees` (
  `id`             VARCHAR(36)   NOT NULL DEFAULT (UUID()),
  `employee_no`    VARCHAR(30)   NOT NULL,
  `name_ar`        VARCHAR(150)  NOT NULL,
  `name_en`        VARCHAR(150)  NULL,
  `role`           VARCHAR(100)  NOT NULL,
  `department`     VARCHAR(100)  NOT NULL,
  `warehouse_id`   VARCHAR(36)   NULL,
  `warehouse_name` VARCHAR(150)  NULL,
  `phone`          VARCHAR(30)   NOT NULL,
  `email`          VARCHAR(150)  NULL,
  `hire_date`      DATE          NOT NULL,
  `salary`         DECIMAL(10,2) NULL,
  `status`         ENUM('active','on_leave','terminated') NOT NULL DEFAULT 'active',
  `created_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_employees_no` (`employee_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Vehicles (Fleet) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id`                    VARCHAR(36)   NOT NULL DEFAULT (UUID()),
  `plate_no`              VARCHAR(30)   NOT NULL,
  `type`                  VARCHAR(100)  NOT NULL,
  `brand`                 VARCHAR(100)  NOT NULL,
  `model`                 VARCHAR(100)  NOT NULL,
  `year`                  INT           NOT NULL,
  `capacity`              DECIMAL(10,2) NOT NULL,
  `unit`                  VARCHAR(30)   NOT NULL DEFAULT 'كجم',
  `driver_id`             VARCHAR(36)   NULL,
  `driver_name`           VARCHAR(150)  NULL,
  `status`                ENUM('available','in_use','maintenance','out_of_service') NOT NULL DEFAULT 'available',
  `last_maintenance_date` DATE          NULL,
  `next_maintenance_date` DATE          NULL,
  `mileage`               INT           NULL,
  `created_at`            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_vehicles_plate` (`plate_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ─── Seed: Admin User ─────────────────────────────────────────
-- Password: Admin@2026  (bcrypt hash)
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`)
VALUES (
  UUID(),
  'مدير النظام',
  'admin@wms.sa',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  1
);

-- ─── Seed: Item Categories ─────────────────────────────────────
INSERT IGNORE INTO `item_categories` (`id`, `name_ar`, `name_en`, `color`) VALUES
  (UUID(), 'حبوب',          'Grains',  '#f59e0b'),
  (UUID(), 'بقوليات',       'Legumes', '#10b981'),
  (UUID(), 'أجبان وألبان',  'Dairy',   '#3b82f6'),
  (UUID(), 'مكسرات',        'Nuts',    '#8b5cf6'),
  (UUID(), 'زيوت',          'Oils',    '#f97316'),
  (UUID(), 'توابل وبهارات', 'Spices',  '#ef4444');

-- ─── Seed: Warehouses ──────────────────────────────────────────
INSERT IGNORE INTO `warehouses` (`id`, `code`, `name_ar`, `name_en`, `type`, `city`, `capacity`, `used_capacity`, `manager_name`, `is_active`) VALUES
  (UUID(), 'RUH-MAIN', 'مستودع الرياض الرئيسي',    'Riyadh Main Warehouse', 'main',         'الرياض',         50000, 32000, 'محمد العتيبي',   1),
  (UUID(), 'JED-01',   'مستودع جدة',                'Jeddah Warehouse',      'branch',       'جدة',            30000, 18000, 'خالد الحربي',    1),
  (UUID(), 'DMM-01',   'مستودع الدمام',             'Dammam Warehouse',      'branch',       'الدمام',         25000, 11000, 'فهد السبيعي',    1),
  (UUID(), 'MED-01',   'مستودع المدينة المنورة',    'Madinah Warehouse',     'branch',       'المدينة المنورة',15000, 7500,  'عمر الزهراني',   1),
  (UUID(), 'RUH-COLD', 'مستودع التبريد الرياض',     'Riyadh Cold Storage',   'cold_storage', 'الرياض',         10000, 8500,  'ناصر القحطاني',  1);
