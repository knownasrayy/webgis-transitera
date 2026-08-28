import numpy as np
import pytest
from app.spatial.ahp import calculate_ahp_weights, calculate_tod_score, DEFAULT_5D_PAIRWISE_MATRIX

def test_ahp_consistency_ratio_within_threshold():
    """Consistency Ratio (CR) wajib <= 0.10 untuk matriks AHP 5D TOD yang valid."""
    weights, cr = calculate_ahp_weights(DEFAULT_5D_PAIRWISE_MATRIX)
    
    assert cr <= 0.10, f"CR = {cr:.4f} melebihi batas toleransi Saaty 0.10"
    assert len(weights) == 5, "Harus menghasilkan 5 bobot dimensi"
    assert abs(np.sum(weights) - 1.0) < 1e-5, "Total bobot harus tepat 1.0"
    assert np.all(weights > 0), "Seluruh bobot harus bernilai positif"

def test_calculate_tod_score():
    """Skor TOD komposit harus berada di rentang 0-100."""
    scores_high = {
        "density": 90.0,
        "diversity": 85.0,
        "design": 80.0,
        "destination_accessibility": 95.0,
        "distance_to_transit": 90.0
    }
    tod_high = calculate_tod_score(scores_high)
    assert 80.0 <= tod_high <= 95.0
    
    scores_low = {
        "density": 40.0,
        "diversity": 45.0,
        "design": 35.0,
        "destination_accessibility": 40.0,
        "distance_to_transit": 50.0
    }
    tod_low = calculate_tod_score(scores_low)
    assert 35.0 <= tod_low <= 50.0
