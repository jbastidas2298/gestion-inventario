import { articuloInventario } from "./articuloInventario";

export interface ArticuloInventarioPage {
    content: articuloInventario[];  
    totalElements: number;          
    totalPages: number;            
    size: number;                  
    number: number;                
  }