# Important Links

- Team wiki (team assignments): https://github.com/StanfordCS194/win25-Team13/wiki
- Team milestones (team assignments): https://github.com/StanfordCS194/win25-Team13/milestones
- Team PRD (google docs): https://docs.google.com/document/d/1uFUsQ_1nsVY4rJfQaBxyoYtCN6jAmFFp2Eeb07hGqq4/edit?usp=sharing
- Course Syllabus (accurate assignment deadlines and schedule): https://docs.google.com/spreadsheets/d/1Y5Lcy-f3GsL_aUVHTDTYkmbaJQqK7sEhrNU9xM57UpQ/edit?usp=sharing

# Setup

- Download 'Expo Go' on your phone's app store. Just Be supports IOS and Android.
- Clone and download the app's code from our github repo.
- Open a terminal, navigate to the folder with the app's code.
- Run 'npm install' and wait for all dependencies and packages.
- Run 'npm start' - it will display a QR code.
- Scan the QR code in your terminal with your phone, which will open - Just Be in Expo Go.

# Credentials

Instructions on how to add .env:

- copy over .env.example and rename to ".env"
- add credentials (should be shared with the team; ping one of us if needed!)
- SUPABASE_URL=https://pjzgrltejhuodohksobs.supabase.co

# Once you've gotten the app running, you should:

1. Sign up and verify your email, then return to the app
2. Complete the onboarding process (prompted by app)

> If you'd like to test the app using our demo account, the credentials are:
>
> - andrehu@gmail.com
> - Test123

We hope you enjoy trying our app!

# Backend

**Supabase**

- Serves as the backend database and authentication provider.
- Provides real-time data synchronization and secure access management.

**Together AI API**

- Used for extracting user single-log and summarizing journal entries.
- Processes natural language input without external assumptions or diagnoses.

# Frontend

**React Native with Expo**

- Enables cross-platform development for iOS and Android.
- Provides a fast refresh environment for streamlined development.

# Infrastructure Visualization

```
                 ┌───────────────────────────────────────────┐
                 │       JustBe Mobile App (Expo)           │
                 │                                          │
                 │            Available on iOS & Android    │
                 │                                          │
                 └───────────────┬──────────────────────────┘
                                 │
                                 │ User authentication & data retrieval
                                 ▼
                 ┌───────────────────────────────────────────┐
                 │                Supabase                   │
                 │ Handles auth, real-time syncing, and DB   │
                 └───────────────────────────────────────────┘
                                 │
                                 │ API requests
                                 ▼
                 ┌───────────────────────────────────────────┐
                 │       Together AI API                     │
                 │ Summarizes user input for insights        │
                 └──────────────────────────────────────────┘
```

# Supabase Table Schema

The detailed entries table saves every entry made. The entry_text field contains the original entry, while the other fields are populated by LLM extracted data.

![image](https://github.com/user-attachments/assets/7210ed67-d409-4c2f-a658-5dbdacdf75a6)

The Count Data table had one row for each user and tracks how many times different conditions were seen for health plot visualizations.

![image](https://github.com/user-attachments/assets/42abc8a8-061e-4aef-9908-ccb32ef3a93d)

For example, the data saved in "symptoms" might look like:
{
"nausea": 2,
"fatigue": 16,
"eye pain": 4,
"headache": 1,
"migraine": 12,
"brain fog": 8,
"nosebleed": 1,
"sore throat": 3,
"sinus pressure": 11,
"nasal stuffiness": 15
}

Both tables use the following auth policies:

![image](https://github.com/user-attachments/assets/2963221d-007f-44c1-b6f3-491b90499136)

# Meet the Team:

Sarah Teaw - BSCS \
Matthew Vilaysack - BS/MSCS \
Andrea Hurtado - BSCS \
Felicity Huang - BSCS \
Em Ho - BSCS
