import openai
import tiktoken
from openai.embeddings_utils import get_embedding, cosine_similarity
import json
import pandas as pd
import ml

tokenizer = tiktoken.get_encoding("cl100k_base")

def settingAPIgpt35():
    # Key and EndPoint set on command prompt
    openai.api_type = "azure"
    openai.api_base = ""
    openai.api_version = "2023-03-15-preview"
    openai.api_key = "" 

def talkwithGPT(api, prompts):
    
    messages = [{"role":"system",
                 "content":"You are a customer service AI assistant of Cathay Pacific named Paxi that assist people's query."}]
    
    messages.append({"role":"user","content":prompts})

    response = openai.ChatCompletion.create(
        engine="gpt-35-turbo-16k",
        messages =messages,
        temperature=0.7,
        max_tokens=500,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None)
    
    answer = response["choices"][0]['message']["content"]
    answer = answer.replace(",,", "\n")

    
    messages.append({"role":"assistant", "content": answer})
    
    history = [answer, messages]
    
    return history

def continchat(api, prompts, messages):
    tokenused = 0

    messages.append({"role":"user","content":prompts})

    for chat in messages:
        curr_content = chat['content']
        number = len(tokenizer.encode(curr_content))
        tokenused = tokenused + number
    
    if (tokenused + 500)>16384:
        answer = "Exceed Token Limit, please refresh the page!"
        return [answer, messages]

    else:
        response = openai.ChatCompletion.create(
            engine="gpt-35-turbo-16k",
            messages =messages,
            temperature=0.7,
            max_tokens=500,
            top_p=0.95,
            frequency_penalty=0,
            presence_penalty=0,
            stop=None)
        
        answer = response["choices"][0]['message']["content"]

        answer = answer.replace(",,", "\n")

        messages.append({"role":"assistant", "content": answer})
        
        history = [answer, messages]
        
        return history

def vectorsearch(api, prompts):
    
    df = pd.read_csv("database/kb.csv")

    queryvector = get_embedding(
        prompts,
        engine="text-embedding-ada-002"
    )
    df['vector'] = df['vector'].apply(lambda x: json.loads(x))
    
    df["similarities"] = df.vector.apply(lambda x: cosine_similarity(x, queryvector))

    df = (
        df.sort_values("similarities", ascending=False)
        .head(3)
    )

    df = df.reset_index()
    df = df.drop("index", axis = 1)

    messages = [{"role":"system",
                 "content":"You are a customer service AI assistant of Cathay Pacific named Paxi that assist people's query."}]
    
    # X use external document.
    tasks = f"""
    The following are the top 3 relevant documents resulting from an vector search:
    1. {df['filename'].iloc[0]}
    {df['content'].iloc[0]} 

    2. {df['filename'].iloc[1]}
    {df['content'].iloc[1]} 

    3. {df['filename'].iloc[2]}
    {df['content'].iloc[2]} 


    Your task is to answer the user's questions by referring to these documents. Follow the requirements below:

    REQUIREMENT1:
    You cannot refer to external data when the provided documents are insufficient to answer the user's prompt.

    REQUIREMENT2:
    Your response to user is limited to around 300 words, please make sure to stay within the limit.

    REQUIREMENT3:
    You should always state the terms and conditions you are refering to.
    """

    messages.append({"role":"user","content":tasks})

    messages.append({"role":"user","content":prompts})

    response = openai.ChatCompletion.create(
        engine="gpt-35-turbo-16k",
        messages =messages,
        temperature=0.7,
        max_tokens=500,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None)
    
    answer = response["choices"][0]['message']["content"]
    print(answer)
    answer = answer.replace(",,", "\n")

    
    messages.append({"role":"assistant", "content": answer})
    
    history = [answer, messages]
    
    return history



def mile_cal_init(api, uid, des, mile, pref):
    
    user = pd.read_csv(r"database\users.csv")

    #Get user info
    row = user[user['code']==uid]
    uname = row['name'][uid]
    curbal = row['miles'][uid]

    sysrole = f"""
    You are a customer service AI assistant of Cathay Pacific named Paxi that assist {uname} and speak friendly.

    Here is the customer information:
    1. Name: {uname}
    2. Credit Card Used: CX Standard Chartered Green Card
    3. Asia Miles Redeem Award Target: {des}
    4. Miles needed for redemption: {mile}
    5. His/Her current Asia Miles Balance: {curbal}

    Based On the backend analysis result, here are top 3 consumption category,
    that have the highest weighted scores in total spending and monthly increase rate:
    1st: {pref[0]}
    2nd: {pref[1]}
    3rd: {pref[2]}  

    This is the promotion detail for CX Standard Chartered Green Card:
    local retail: $6/mile

    foreign currency transactions: $4/mile

    Online spending (HKD): $4/mile

    Online payment (foreign currency): $4/mile

    PayMe value-added: $6/mile

    local dining: $4/mile (Any local restaurant)

    Cathay Pacific/HK Express Spending:
    - Eligible spending includes Cathay flight tickets, shopping and bookings with Cathay Holidays, and HK Express flight tickets and duty-free items.
    For every HKD8,000 accumulated eligible spending on Cathay and HK Express directly, cardholders can earn:
    Basic Miles: up to Asia Miles 2,000 (HKD4= Asia Miles 1 for eligible online spending, HKD6= Asia Miles 1 for eligible spending in other categories); and
    Extra Miles:  Asia Miles 2,000.
    Thus, cardholders can earn up to a total of Asia Miles 4,000 – equivalent to HKD2= Asia Miles 1. The Extra Miles offer is valid between 1 October and 31 December​ 2023.

    - Eligible purchases only. Terms and conditions apply.

    - Cardholders can earn Status Points in a calendar year. The Status Points earned will be credited to eligible cardholders’ Cathay membership account on or before 31 March of the following year.

    - HKD4 = Asia Miles2 for eligible spending on dining at our partner restaurants, plus HKD4 = Asia Miles1 dining rewards when you pay with your card for a total of HKD4 = 3 Asia Miles.

    - Valid between 1 March 2023 and 31 December 2023. Offer is subject to blackout dates and cannot be used in conjunction with other offers, please contact EAST Hong Kong(https://www.easthotels.com/en/hongkong/restaurants-and-bars/) for details.

    - Valid between 1 March 2023 and 31 December 2023. Standard Chartered Cathay Mastercard cardholders shall quote “CXSCBEHK” upon reservation. Room upgrade is subject to room availability. Please contact EAST Hong Kong(https://www.easthotels.com/en/hongkong/restaurants-and-bars/) for details. 

    Asia Miles partner:
    Oneworld airlines: Alaska Airlines, American Airlines, British Airways, Cathay Pacific, Fiji Airways (Oneworld Connect member), Finnair, Iberia, Japan Airlines, Malaysia Airlines, Qantas, Qatar Airways, Royal Air Maroc, Royal Jordanian Airlines, SriLankan Airlines
    NOT Oneworld airlines: Air Canada (Star Alliance), Air China (Star Alliance), Air New Zealand (Star Alliance), Austrian Airlines (Star Alliance), Bangkok Airways, Gulf Air, LATAM, Lufthansa (Star Alliance), S7 Airlines, Shenzhen Airlines (Star Alliance), Swiss (Star Alliance)
    Hotel: Accor Live Limitless, Best Western Rewards, Hilton Honors, IHG One Rewards, Marriott Bonvoy, Regal Rewards, Shangri-La Circle, World of Hyatt
    Cloth/Footwear Retailer: The merchants include Marathon Sports, GigaSports, Catalog, Speedo, Arena, Crocs, Havaianas, UGG, Rockport, Cath Kidston, Columbia, GoWild and Chevignon.

    List of Requirements:
    1. You can only refer to the promotion information and user consumption data to make recommendations or answering user query.

    2. You are not allow to use external data to answer user query

    3. Please make your answer concise, simple, and within 100 words.

    4. When making recommendations, always refer to the Asia Miles Balance.

    5. If {uname} has sufficient Asia Miles to redeem the reward, congrats him/her!

    """
 
    messages = [{"role":"system",
                 "content":sysrole}]
    
    
    response = openai.ChatCompletion.create(
        engine="gpt-35-turbo-16k",
        messages =messages,
        temperature=0.7,
        max_tokens=500,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None)
    
    answer = response["choices"][0]['message']["content"]
    answer = answer.replace(",,", "\n")
    print(answer)
    
    messages.append({"role":"assistant", "content": answer})
    
    history = [answer, messages]
    
    return history
