-- CreateEnum
CREATE TYPE "EstadoPropiedad" AS ENUM ('disponible', 'reservada', 'alquilada', 'vendida');

-- AlterTable
ALTER TABLE "Propiedad" ADD COLUMN "estado" "EstadoPropiedad" NOT NULL DEFAULT 'disponible';
