CREATE TABLE IF NOT EXISTS public."tblCustomers"
(
    customer_id integer NOT NULL DEFAULT nextval('"Customers_customer_id_seq"'::regclass),
    shipping_address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    company_name character varying(255) COLLATE pg_catalog."default",
    first_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Customers_pkey" PRIMARY KEY (customer_id)
)

CREATE TABLE IF NOT EXISTS public."tblInventory"
(
    inventory_id integer NOT NULL DEFAULT nextval('"tblInventory_inventory_id_seq"'::regclass),
    on_hand integer NOT NULL,
    last_restock date,
    material_id integer NOT NULL,
    CONSTRAINT "tblInventory_pkey" PRIMARY KEY (inventory_id),
    CONSTRAINT "tblInventory_material_id_key" UNIQUE (material_id),
    CONSTRAINT "tblInventory_material_id_fkey" FOREIGN KEY (material_id)
        REFERENCES public."tblMaterials" (material_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

CREATE TABLE IF NOT EXISTS public."tblMaterials"
(
    material_id integer NOT NULL DEFAULT nextval('"tblMaterials_material_id_seq"'::regclass),
    material_type character varying(255) COLLATE pg_catalog."default" NOT NULL,
    material_price numeric(10,2) NOT NULL,
    material_color character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "tblMaterials_pkey" PRIMARY KEY (material_id),
    CONSTRAINT "tblMaterials_material_type_material_color_key" UNIQUE (material_type, material_color)
)

CREATE TABLE IF NOT EXISTS public."tblOrder_Items"
(
    item_id integer NOT NULL DEFAULT nextval('"Order_Items_item_id_seq"'::regclass),
    order_id integer NOT NULL,
    quantity integer NOT NULL,
    material_id integer NOT NULL,
    CONSTRAINT "Order_Items_pkey" PRIMARY KEY (item_id),
    CONSTRAINT "tblOrder_Items_material_id_fkey" FOREIGN KEY (material_id)
        REFERENCES public."tblMaterials" (material_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "tblOrder_Items_order_id_fkey" FOREIGN KEY (order_id)
        REFERENCES public."tblOrders" (order_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

CREATE TABLE IF NOT EXISTS public."tblOrders"
(
    order_id integer NOT NULL DEFAULT nextval('"tblOrders_order_id_seq"'::regclass),
    order_date date NOT NULL,
    order_tracking_info character varying(255) COLLATE pg_catalog."default",
    customer_id integer,
    CONSTRAINT "tblOrders_pkey" PRIMARY KEY (order_id),
    CONSTRAINT "tblOrders_customer_id_fkey" FOREIGN KEY (customer_id)
        REFERENCES public."tblCustomers" (customer_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)