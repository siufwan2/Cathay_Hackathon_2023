import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder
label_encoder = LabelEncoder()
import random

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns


testdata = {'userCode': 1126.0,
            'flightType': 2.0,
            'ticket_price': 481.42,
            'gender': 1.0,
            'age': 27.0,
            'from_Aracaju (SE)': 0.0,
            'from_Brasilia (DF)': 0.0,
            'from_Campo Grande (MS)': 0.0,
            'from_Florianopolis (SC)': 1.0,
            'from_Natal (RN)': 0.0,
            'from_Recife (PE)': 0.0,
            'from_Rio de Janeiro (RJ)': 0.0,
            'from_Salvador (BH)': 0.0,
            'from_Sao Paulo (SP)': 0.0,
            'agency_CloudFy': 0.0,
            'agency_FlyingDrops': 0.0,
            'agency_Rainbow': 1.0,
            'company_4You': 0.0,
            'company_Acme Factory': 1.0,
            'company_Monsters CYA': 0.0,
            'company_Umbrella LTDA': 0.0,
            'company_Wonka Company': 0.0}

def flightpred(data):
    # ucode: uid, ugender:ugender, uage: uage, 
    # uloc: ulocat, ucomp: ucamp

    gen = 2.0  # Set a default value: None

    if data['ugender']=='female':
        gen = 0.0
    elif data['ugender']=='male':
        gen = 1.0

    #SET UP THE DEFAULT VALUE
    act_data = {'userCode': int(data['ucode']),
                'flightType': 0.0,
                'ticket_price': 0.0,
                'gender': gen,
                'age': int(data['uage']),
                'from_Aracaju (SE)': 0.0,
                'from_Brasilia (DF)': 0.0,
                'from_Campo Grande (MS)': 0.0,
                'from_Florianopolis (SC)': 0.0,
                'from_Natal (RN)': 0.0,
                'from_Recife (PE)': 0.0,
                'from_Rio de Janeiro (RJ)': 0.0,
                'from_Salvador (BH)': 0.0,
                'from_Sao Paulo (SP)': 0.0,
                'agency_CloudFy': 0.0,
                'agency_FlyingDrops': 0.0,
                'agency_Rainbow': 0.0,
                'company_4You': 0.0,
                'company_Acme Factory': 0.0,
                'company_Monsters CYA': 0.0,
                'company_Umbrella LTDA': 0.0,
                'company_Wonka Company': 0.0}
    
    #sub the loc to 1
    loc = data['uloc']


    for key in list(act_data.keys()):
        if loc in str(key):
            act_data[key] = 1.0
            break
        else:
            continue

    #sub the company to 1
    com = data['ucomp']

    for key in list(act_data.keys()):
        if com in str(key):
            act_data[key] = 1.0
            break
        else:
            continue
    #locate the mean of flightType & ticket_price
    f3 = r"database\users.csv"
    user = pd.read_csv(f3)
    user.rename(columns={'code': 'userCode'}, inplace=True)

    f1 = r"database\flights.csv"
    fly = pd.read_csv(f1)
    ufh = fly.merge(user, on=['userCode'], how='inner')

    tick_price = ufh.groupby('userCode')['price'].mean()[data['ucode']]

    ufh['flightType'] = label_encoder.fit_transform(ufh['flightType'])

    ftype = ufh.groupby('userCode')['flightType'].mean()[data['ucode']]
    threshold_1 = 0.5
    threshold_2 = 1.5

    if ftype < threshold_1:
        ftype = 0
    elif ftype < threshold_2:
        ftype = 1
    else:
        ftype = 2

    act_data['flightType'] = ftype

    #First Choice: Predict their dream destination based on NN
    savepath = r"nn_predflight.h5"
    
    # Load the pre-trained model
    model = tf.keras.models.load_model(savepath)
    print(act_data)

    # Now you can use the loaded model for predictions
    predictions = model.predict(pd.DataFrame(act_data, index=[0]))[0]

    destinations = ['to_Aracaju (SE)', 'to_Brasilia (DF)', 'to_Campo Grande (MS)', 'to_Florianopolis (SC)', 'to_Natal (RN)', 'to_Recife (PE)', 'to_Rio de Janeiro (RJ)', 'to_Salvador (BH)', 'to_Sao Paulo (SP)']

    value_location_pairs = list(zip(predictions, destinations))

    # Sort the pairs based on the values in descending order
    sorted_pairs = sorted(value_location_pairs, reverse=True)

    top_3_locations = [pair[1] for pair in sorted_pairs[:3]]

    top_3_dest = {"first": top_3_locations[0][3:],
                "second": top_3_locations[1][3:],
                "third": top_3_locations[2][3:]}
    print(top_3_dest)
    return top_3_dest


# Function to probabilistically sample the data based on category probabilities
def probabilistic_sample(data, probabilities, sample_size):
    
    sampled_data = []
    
    categories = list(probabilities.keys())
    
    for category in categories:
        
        # Calculate the number of samples for the category based on the probability
        num_samples = int(sample_size * probabilities[category])
        
        # Filter data for the current category
        category_data = data[data['category'] == category]
        
        if len(category_data) >= num_samples:
            # Randomly sample data for the category
            sampled_data.append(category_data.sample(n=num_samples, replace=True))
            
    return pd.concat(sampled_data)

def getpattern():
    df = pd.read_csv(r"database\pastpurdata.csv")
    # Define the probabilities based on the 'Probi' dictionary
    Probi = {
        'Clothing': 0.08,
        'Cosmetics': 0.05,
        'Flight Ticket': 0.02,
        'Food & Beverage': 0.35,
        'Hotel': 0.02,
        'Technology': 0.03,
        'Transportation': 0.4,
        'Luxury': 0.02
    }

    # List to store sampled DataFrames for each time range
    time_ranges = ['2022-08', '2021-12', '2021-11', '2021-05', '2021-10', '2022-05', '2022-03',
    '2021-01', '2021-08', '2022-12', '2022-10', '2022-07', '2022-11', '2022-06',
    '2022-01', '2021-07', '2023-03', '2023-02', '2022-04', '2021-04', '2022-02',
    '2023-01', '2021-09', '2021-06', '2021-03', '2021-02', '2022-09']

    # Number of samples for each time range
    sample_size_per_range = 80
    sampled_dfs = []

    for time_range in time_ranges:
        # Filter the DataFrame for the current time range
        time_range_df = df[df['M/Y'] == time_range]

        if len(time_range_df) >= sample_size_per_range:
            # Probabilistically sample the data for the current time range
            sample_df = probabilistic_sample(time_range_df, Probi, sample_size_per_range)

            # Append the sampled DataFrame to the list
            sampled_dfs.append(sample_df)

    # Concatenate all the sampled DataFrames
    sampled_data = pd.concat(sampled_dfs)

    # Optionally, you can reset the index of the concatenated DataFrame
    sampled_data = sampled_data.reset_index(drop=True)

    # Loop through unique categories
    for category_to_visualize in df['category'].unique():
        # Filter the data for the specific category you want to visualize
        filtered_data = sampled_data[sampled_data['category'] == category_to_visualize]

        # Group the filtered data by month/year and sum the prices
        monthly_spending = filtered_data.groupby(sampled_data['M/Y'])['price'].sum()

        # Create a line chart to visualize the monthly spending for the selected category
        monthly_spending.plot(kind='line', marker='o')
        plt.title(f'Monthly Spending for {category_to_visualize} Over Time')
        plt.xlabel('Month/Year')
        plt.ylabel('Total Spending')
        plt.grid(True)

        # Save the plot as an image (e.g., in PNG format)
        plt.savefig(f'static/spending_{category_to_visualize.strip()}.png')
        
        # Close the plot to release resources
        plt.close()

    # Calculate the counts of different categories
    category_counts = sampled_data['category'].value_counts()

    # Create a pie chart
    plt.figure(figsize=(8, 8))
    plt.pie(category_counts, labels=category_counts.index, autopct='%1.1f%%', startangle=140)
    plt.title('Distribution of Different Categories')
    plt.savefig(f'static/spending_piechart.png')
    plt.close()

    # Calculate the total spending for each category in each M/Y
    monthly_spending = sampled_data.groupby(['M/Y', 'category'])['price'].sum().unstack(fill_value=0)


    # Calculate the monthly increase rate for each category
    monthly_increase_rate = monthly_spending.pct_change().replace([np.inf, -np.inf], np.nan)

    # Calculate the appearance count for each category
    appearance_count = monthly_spending.apply(lambda x: x.gt(0).sum())

    # Assign weights to the metrics
    weight_increase_rate = 0.4
    weight_appearance = 0.6

    # Calculate the combined score for each category
    combined_score = (monthly_increase_rate * weight_increase_rate) + (appearance_count * weight_appearance)

    # Rank the categories based on the combined score
    ranked_categories = combined_score.sum().sort_values(ascending=False)

    # Extract the top 3 categories with the highest combined scores
    top_3_categories = ranked_categories.head(3)

    # Print the result
    print(top_3_categories)

    top_3_category_dict = dict(top_3_categories)
    top_3_category_keys = list(top_3_category_dict.keys())
    return top_3_category_keys