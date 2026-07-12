import pandas as pd
import json
import joblib
from sklearn.ensemble import RandomForestClassifier

def train_static_anomaly():
    print("Loading static relational dataset...")
    with open("data/sample_data.json", "r") as f:
        data = json.load(f)

    df_assets = pd.DataFrame(data["assets"])
    df_maint = pd.DataFrame(data["maintenances"])
    df_audits = pd.DataFrame(data["auditItems"])

    # Feature Engineering: Count maintenance encounters
    maint_counts = df_maint['assetId'].value_counts().to_dict()
    df_assets['maintenance_count'] = df_assets['id'].map(maint_counts).fillna(0)

    # Feature Engineering: Flag known audit issues
    damaged_assets = df_audits[df_audits['status'] == 'DAMAGED']['assetId'].tolist()
    df_assets['damaged_in_audit'] = df_assets['id'].apply(lambda x: 1 if x in damaged_assets else 0)

    # Target Mapping: 1 = Needs immediate attention, 0 = Healthy operational status
    df_assets['needs_intervention'] = df_assets.apply(
        lambda r: 1 if r['condition'] == 'POOR' or r['status'] == 'UNDER_MAINTENANCE' or r['damaged_in_audit'] == 1 else 0,
        axis=1
    )

    # Encode Categories manually for small sample matrix
    df_assets['is_laptop'] = df_assets['category'].apply(lambda x: 1 if x == 'Laptop' else 0)
    
    X = df_assets[['cost', 'maintenance_count', 'damaged_in_audit', 'is_laptop']]
    y = df_assets['needs_intervention']

    # Train structural classifier
    model = RandomForestClassifier(n_estimators=10, random_state=42)
    model.fit(X, y)
    
    joblib.dump(model, 'static_anomaly_model.pkl')
    print(" Saved 'static_anomaly_model.pkl' successfully!\n")

if __name__ == "__main__":
    train_static_anomaly()