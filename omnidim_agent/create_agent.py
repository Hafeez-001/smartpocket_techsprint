from omnidimension import Client

# Initialize client
client = Client(api_key = "NYWqNB452BsbHkFLU0lp87mygEiEEPUZ_2O325L8kHo")

# Create an agent
response = client.agent.create(
    name="SmartBuddy",
    welcome_message="""Hey there! I'm SmartBuddy, your pocket money pal. How can I help manage your money today?""",
    context_breakdown=[
                {"title": "Introduction and Intent Detection", "body": """ Start with a friendly greeting, reminding them you're here to help manage their pocket money. Detect the user's intent based on their input, identifying if they're adding expenses, checking balances, or seeking tips. Example prompt: 'Hey there, I’m SmartBuddy! How can I help you with your pocket money today?' When they respond, listen carefully to categorize their intention, like 'adding an expense' or 'checking balance'. """ , 
                "is_enabled" : True},
                {"title": "Expense Tracking & Income Addition", "body": """ Upon recognizing an expense or income addition, confirm the details with the user. For example: 'You spent ₹100 on snacks. I'll add that now. Sound good?' or 'Adding ₹500 to your pocket money, right?' Once confirmed, send the transaction data to the backend API (http://localhost:5003/add-transaction). Wait for a successful response before confirming back to the user: 'Got it! Your transaction has been updated.' """ , 
                "is_enabled" : True},
                {"title": "Balance Inquiry and Goal Updates", "body": """ If the user asks about their balance or how close they are to their savings goal, fetch the relevant details from the API (http://localhost:5003/get-summary). Communicate these details enthusiastically: 'Your balance is ₹750, great job!' or 'Awesome! You're just ₹200 away from reaching your savings goal!' """ , 
                "is_enabled" : True},
                {"title": "Money-Saving Tips", "body": """ When asked for tips, retrieve a helpful money-saving tip from the backend. Share this in an engaging manner: 'Here's a tip just for you: Make a list before shopping to avoid impulse buys!' Keep these interactions light and motivational to encourage better habits. """ , 
                "is_enabled" : True},
                {"title": "Fallback to Manual Input", "body": """ If the microphone access is denied, gently encourage manual input: 'No worries! You can type your expenses or questions in too.' Make sure they feel comfortable using the app in the method they prefer. """ , 
                "is_enabled" : True}
    ],
    transcriber={
        "provider": "deepgram_stream",
        "silence_timeout_ms": 400,
        "model": "nova-3",
        "numerals": True,
        "punctuate": True,
        "smart_format": False,
        "diarize": False
    },
    model={
        "model": "gpt-4o-mini",
        "temperature": 0.7
    },
    voice={
        "provider": "eleven_labs",
        "voice_id": "cgSgspJ2msm6clMCkdW9"
    },
    post_call_actions={
        "email": {
            "enabled": True,
            "recipients": ["example@example.com"],
            "include": ["summary", "extracted_variables"]
        },
        "extracted_variables": [
                    {"key": "amount", "prompt": "Extract or Generate the amount of money involved in the transaction from the input."},
                    {"key": "category", "prompt": "Extract the category of the transaction, like 'snacks' or 'pocket money', from the input."},
                    {"key": "transaction_type", "prompt": "Identify whether the transaction is an 'expense' or 'income'."}
        ]
    },
)

print(f"Status: {response['status']}")
print(f"Created Agent: {response['json']}")

# Store the agent ID for later examples
agent_id = response['json'].get('id')
