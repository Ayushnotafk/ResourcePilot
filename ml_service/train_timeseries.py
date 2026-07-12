import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

def train_timeseries_predictive():
    print(" [Dataset 2] Loading continuous time-series history...")
    df = pd.read_csv("data/sample_timeseries.csv")

    # Drop explicit identifiers
    df_ml = df.drop(columns=['date', 'assetTag', 'assetName'])
    df_ml['maintenancePriority'] = df_ml['maintenancePriority'].fillna('NONE')
    df_ml['issueType'] = df_ml['issueType'].fillna('NONE')

    X = df_ml.drop(columns=['nextDayFailure'])
    y = df_ml['nextDayFailure']

    num_features = ['dailyUsageHours', 'bookingCount', 'allocationActive', 'conditionScore', 
                    'daysSinceMaintenance', 'maintenanceRequests', 'maintenanceEvent', 'failureRisk']
    cat_features = ['assetCategory', 'department', 'location', 'status', 'maintenancePriority', 'issueType']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), num_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), cat_features)
        ])

    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'))
    ])

    print(" Training machine learning forecasting pipeline...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
    pipeline.fit(X_train, y_train)

    joblib.dump(pipeline, 'timeseries_predictive_model.pkl' )
    print(" Saved 'timeseries_predictive_model.pkl' successfully!\n")

if __name__ == "__main__":
    train_timeseries_predictive()