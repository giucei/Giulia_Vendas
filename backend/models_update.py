from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class Produto(BaseModel):
    id: Optional[int] = None
    nome: str = Field(..., min_length=3, max_length=60)
    descricao: Optional[str] = None
    preco: float = Field(..., gt=0)
    estoque: int = Field(..., ge=0)
    categoria: str = Field(..., min_length=2, max_length=30)
    sku: Optional[str] = None

class StatusPedido(str, Enum):
    PENDENTE = "pendente"
    CONFIRMADO = "confirmado"
    ENVIADO = "enviado"
    ENTREGUE = "entregue"
    CANCELADO = "cancelado"

class ItemPedido(BaseModel):
    produto_id: int
    quantidade: int = Field(..., gt=0)
    preco_unitario: float
    subtotal: float

class Pedido(BaseModel):
    id: Optional[int] = None
    cliente_nome: str = Field(..., min_length=3)
    cliente_email: str
    items: List[ItemPedido]
    total_produtos: float
    desconto: float = 0
    total_final: float
    status: StatusPedido = StatusPedido.PENDENTE
    data: datetime = Field(default_factory=datetime.now)

class CarrinhoItem(BaseModel):
    produto_id: int
    quantidade: int = Field(..., gt=0)

class Carrinho(BaseModel):
    items: List[CarrinhoItem]
    cupom: Optional[str] = None
