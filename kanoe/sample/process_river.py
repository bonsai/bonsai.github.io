

import numpy as np
import cv2

def simplify_river_shape(river_points, simplification_level=0.001):
    """
    OpenCVを使用して河川の座標点リストを単純化（平滑化）する。

    Args:
        river_points (list of tuples): 河川の形状を表す座標点のリスト。例: [(x1, y1), (x2, y2), ...]
        simplification_level (float): 単純化の度合いを調整するε（イプシロン）値。
                                     値が小さいほど元の形状に忠実になり、大きいほど単純化される。

    Returns:
        np.ndarray: 単純化された座標点のNumpy配列。
    """
    # 入力データをNumpy配列に変換
    points = np.array(river_points, dtype=np.float32).reshape((-1, 1, 2))

    # approxPolyDPは閉じた輪郭（ポリゴン）を想定しているため、closed=Falseを指定する
    simplified_points = cv2.approxPolyDP(points, simplification_level, closed=False)

    return simplified_points.reshape((-1, 2))

def points_to_svg_path(points):
    """
    座標点の配列をSVGの<path>要素のd属性文字列に変換する。
    ここでは単純な直線（L）で結ぶ形式とする。より滑らかにするにはベジェ曲線（C）などを使う。

    Args:
        points (np.ndarray): 座標点のNumpy配列。

    Returns:
        str: SVGパスのd属性文字列。
    """
    if len(points) == 0:
        return ""
    
    # 開始点
    path_str = f"M {points[0][0]} {points[0][1]}"
    
    # 2点目以降を直線で結ぶ
    for i in range(1, len(points)):
        path_str += f" L {points[i][0]} {points[i][1]}"
        
    return path_str

if __name__ == '__main__':
    # --- ダミーデータと使用例 ---

    # 1. ダミーの河川データを作成（実際にはMAP APIから取得する）
    #    川が蛇行しているような、複雑な座標点リストを想定
    dummy_river_points = [
        (10, 100), (15, 110), (25, 115), (30, 120), (32, 130), (35, 145),
        (40, 150), (50, 152), (60, 148), (70, 140), (75, 130), (80, 125),
        (90, 130), (100, 140), (110, 155), (115, 160), (120, 170), (130, 180)
    ]

    print("--- 元のデータ ---")
    print(f"座標点の数: {len(dummy_river_points)}")
    # print(dummy_river_points)

    # 2. 河川形状を単純化する
    #    simplification_levelの値を調整して、単純化の度合いを変えることができる
    #    例: 1.0 (かなり単純化), 5.0 (さらに単純化)
    epsilon = 3.0
    simplified_points = simplify_river_shape(dummy_river_points, simplification_level=epsilon)

    print(f"\n--- 単純化後のデータ (ε={epsilon}) ---")
    print(f"座標点の数: {len(simplified_points)}")
    print(simplified_points)

    # 3. 単純化された座標点をSVGパス文字列に変換する
    svg_path = points_to_svg_path(simplified_points)

    print("\n--- 生成されたSVGパス文字列 ---")
    print(svg_path)

    # 4. HTMLで表示するための簡単なSVGファイルを出力
    svg_content = f"""<?xml version="1.0" encoding="UTF-8"?>
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid black;">
        <!-- 元の形状（灰色で表示） -->
        <path d="{points_to_svg_path(np.array(dummy_river_points))}" stroke="lightgray" stroke-width="2" fill="none" />
        
        <!-- 単純化された形状（青色で表示） -->
        <path d="{svg_path}" stroke="blue" stroke-width="3" fill="none" />
    </svg>
    """
    with open("river_shape_test.svg", "w", encoding="utf-8") as f:
        f.write(svg_content)
        
    print("\n'river_shape_test.svg' に結果を出力しました。ブラウザで開いて確認してください。")

