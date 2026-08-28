import numpy as np
from typing import Tuple, Dict, List

# Saaty Random Index (RI) lookup table
RI_DICT = {
    1: 0.00,
    2: 0.00,
    3: 0.58,
    4: 0.90,
    5: 1.12,
    6: 1.24,
    7: 1.32,
    8: 1.41,
    9: 1.45,
    10: 1.49
}

# 5D TOD Default Pairwise Matrix (Density, Diversity, Design, Destination, Distance)
# Based on expert panel consensus from PWK ITS / TransitERA research
DEFAULT_5D_PAIRWISE_MATRIX = np.array([
    [1.0,     1.2,     1.5,     1.3,     1.1],     # Density
    [1/1.2,   1.0,     1.3,     1.1,     1.0],     # Diversity
    [1/1.5,   1/1.3,   1.0,     1.0,     1/1.2],   # Design
    [1/1.3,   1/1.1,   1.0,     1.0,     1.0],     # Destination Accessibility
    [1/1.1,   1.0,     1.2,     1.0,     1.0]      # Distance to Transit
])

def calculate_ahp_weights(pairwise_matrix: np.ndarray) -> Tuple[np.ndarray, float]:
    """
    Menghitung bobot prioritas AHP dan Consistency Ratio (CR).
    Matriks pairwise wajib persegi berukuran n x n dengan a_ij * a_ji = 1.
    """
    n = pairwise_matrix.shape[0]
    if n < 2:
        return np.ones(n), 0.0
    
    # 1. Normalisasi kolom matriks
    col_sum = pairwise_matrix.sum(axis=0)
    norm_matrix = pairwise_matrix / col_sum
    
    # 2. Vektor bobot prioritas (Principal Eigenvector approximation)
    weights = norm_matrix.mean(axis=1)
    
    # 3. Hitung eigenvalue maksimum (lambda_max)
    weighted_sum = np.dot(pairwise_matrix, weights)
    lambda_max = np.mean(weighted_sum / weights)
    
    # 4. Consistency Index (CI) & Consistency Ratio (CR)
    ci = (lambda_max - n) / (n - 1)
    ri = RI_DICT.get(n, 1.12)
    cr = ci / ri if ri > 0 else 0.0
    
    return weights, float(cr)

def calculate_tod_score(dimension_raw_scores: Dict[str, float], weights: np.ndarray = None) -> float:
    """
    Menghitung composite TOD Readiness Score (0–100) dari 5 dimensi.
    """
    if weights is None:
        weights, cr = calculate_ahp_weights(DEFAULT_5D_PAIRWISE_MATRIX)
        if cr > 0.10:
            raise ValueError(f"Matriks AHP inkonsisten: CR={cr:.4f} > 0.10")
    
    dim_keys = ["density", "diversity", "design", "destination_accessibility", "distance_to_transit"]
    raw_vector = np.array([dimension_raw_scores.get(k, 0.0) for k in dim_keys])
    
    score = np.dot(weights, raw_vector)
    return float(np.clip(score, 0.0, 100.0))
