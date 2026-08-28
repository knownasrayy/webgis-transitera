import numpy as np

class AHPCalculator:
    def __init__(self):
        # Random Index (RI) based on n (size of matrix)
        self.RI = {
            1: 0.00, 2: 0.00, 3: 0.58, 4: 0.90, 5: 1.12, 
            6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
        }

    def calculate_weights(self, matrix: list[list[float]]) -> dict:
        """
        Calculate AHP weights and validate Consistency Ratio (CR)
        matrix: nxn pairwise comparison matrix
        Returns: {'weights': [w1, w2...], 'cr': float, 'is_consistent': bool}
        """
        A = np.array(matrix)
        n = A.shape[0]

        # 1. Normalize the column sums
        col_sums = A.sum(axis=0)
        normalized_matrix = A / col_sums

        # 2. Calculate the principal eigenvector (Priority Vector / Weights)
        weights = normalized_matrix.mean(axis=1)

        # 3. Calculate Consistency Measure
        weighted_sum = np.dot(A, weights)
        consistency_measure = weighted_sum / weights

        # 4. Calculate lambda_max, Consistency Index (CI) and Consistency Ratio (CR)
        lambda_max = consistency_measure.mean()
        
        if n > 1:
            ci = (lambda_max - n) / (n - 1)
        else:
            ci = 0.0

        ri = self.RI.get(n, 1.49)
        cr = ci / ri if ri > 0 else 0.0

        return {
            "weights": weights.tolist(),
            "cr": cr,
            "is_consistent": cr <= 0.10
        }

    def calculate_tod_score(self, scores_5d: dict[str, float], weights: list[float]) -> float:
        """
        Calculates final TOD Readiness Score based on 5D scores and weights
        scores_5d: dict containing 'density', 'diversity', 'design', 'destination', 'distance'
        weights: list of weights corresponding to the 5Ds
        """
        score_values = [
            scores_5d.get('density', 0),
            scores_5d.get('diversity', 0),
            scores_5d.get('design', 0),
            scores_5d.get('destination', 0),
            scores_5d.get('distance', 0)
        ]
        
        # Multiply each score by its corresponding weight and sum
        final_score = sum(s * w for s, w in zip(score_values, weights))
        
        # Ensure it scales to 100
        return min(100.0, max(0.0, final_score))
