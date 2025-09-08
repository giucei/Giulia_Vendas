from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Produto(BaseModel):
    id: Optional[int] = None
    nome: str = Field(..., min_length=3, max_length=60)
    descricao: Optional[str] = None
    preco: float = Field(..., gt=0)
    estoque: int = Field(..., ge=0)
    categoria: str = Field(..., min_length=2, max_length=30)
    sku: Optional[str] = None

class Pedido(BaseModel):
    id: Optional[int] = None
    total_final: float
    data: datetime
