# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Tuple

# process_river.pyから関数をインポート
from process_river import simplify_river_shape, points_to_svg_path

app = FastAPI()

# --- リクエストとレスポンスのデータモデルを定義 ---

class Point(BaseModel):
    x: float
    y: float

class RiverDataRequest(BaseModel):
    river_points: List[Point]
    simplification_level: float = 1.0

class SvgPathResponse(BaseModel):
    svg_path_string: str

# --- APIエンドポイントの定義 ---

@app.post("/generate_river_svg", response_model=SvgPathResponse)
async def generate_river_svg(request: RiverDataRequest):
    """
    河川の座標点リストを受け取り、単純化してSVGパス文字列を返すAPI。
    """
    # Pydanticモデルのリストを、関数の入力形式（タプルのリスト）に変換
    points_as_tuples = [(p.x, p.y) for p in request.river_points]
    
    # 河川形状を単純化
    simplified_points = simplify_river_shape(
        points_as_tuples, 
        request.simplification_level
    )
    
    # SVGパス文字列に変換
    svg_path = points_to_svg_path(simplified_points)
    
    return {"svg_path_string": svg_path}

@app.get("/")
async def root():
    return {"message": "River Shape SVG Generator API is running."}

# --- サーバーを起動するためのコマンド ---
# uvicorn main:app --reload
