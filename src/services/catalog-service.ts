import { categoryRepository } from "@/repositories/category-repository";
import { locationRepository } from "@/repositories/location-repository";
import { productRepository } from "@/repositories/product-repository";
import { reorderRuleRepository } from "@/repositories/reorder-rule-repository";
import { stockRepository } from "@/repositories/stock-repository";
import { warehouseRepository } from "@/repositories/warehouse-repository";

export function listCategories() {
  return categoryRepository.list();
}

export function listProducts() {
  return productRepository.list();
}

export function listWarehouses() {
  return warehouseRepository.list();
}

export function listLocations() {
  return locationRepository.list();
}

export function listStock() {
  return stockRepository.list();
}

export function listReorderRules() {
  return reorderRuleRepository.list();
}
