import numpy as np
import pandas as pd

def initialize(X, K):
    n, d = X.shape
    min_val = X.min(axis=0)
    max_val = X.max(axis=0)
    centroids = np.random.uniform(min_val, max_val, size=(K, d))
    
    return centroids

def get_close(X, centoides):
    distances = np.sqrt(np.sum((X - centoides[:, np.newaxis]) ** 2, axis=2))
    
    return np.argmin(distances, axis=0)


def kmeans(X, K, iterations=1000):
    centroides = initialize(X, K)
    
    for _ in range(iterations):
        old_centroid = np.copy(centroides)
        close = get_close(X, centroides)
        
        for i in range(K):
            if (X[close == i].size == 0):
                centroides[i] =  (
                    np.random.uniform(
                        np.min(X, axis=0), np.max(X, axis=0), size=(1, X.shape[1])
                    )
                )
            else:
                centroides[i] = np.mean(X[close == i], axis=0)
                
        if np.allclose(old_centroid, centroides):
            break
        
    return centroides, get_close(X, centroides)


def silhoutte_score(X, label):
    n = X.shape[0]
    uniq_label = np.unique(label)
    score_value = []
    
    for i in range(n):
        same_cluster = X[label == label[i]]
        diff_cluster = (
            [X[label == j] for j in uniq_label if j != label[i]]
        )
        
        a = np.mean(
            np.linalg.norm(same_cluster - X[i], axis=1)) if len(same_cluster) > 1 else 0
        
        b = np.min(
            [np.mean(np.linalg.norm(cluster - X[i], axis=1)) for cluster in diff_cluster]
        )
        
        s = (b - a) / max(a, b) if max(a, b) > 0 else 0
        
        score_value.append(s)
    
    return np.mean(score_value)
        
        
df = pd.read_csv("../csv/userData/Ariana.csv")

X = df[["totalConsumption"]].values


best_score = -1
best_k = 0
best_label = None

for k in range(2, 6):
    centroids, label = kmeans(X, k)
    score = silhoutte_score(X, label)
    print(f"k = {k}, silhoutte score =  {score: .3f}")
    
    if score > best_score:
        best_score = score
        best_k = k
        best_label = label
    
print(f"best number for choose clusters: k={best_k}, score={best_score:.3f}")

df["cluster"] = best_label
print(df.head())

centroids, label = kmeans(X, K=2)
print("centoids: ", centroids.flatten())



low_centroid = centroids.min()
high_centroid = centroids.max()

low_consumption = df[df["totalConsumption"] < low_centroid]
high_consumption = df[df["totalConsumption"] > high_centroid]

print("Low consumption clients:")
print(low_consumption)

print("\nHigh consumption clients:")
print(high_consumption)
