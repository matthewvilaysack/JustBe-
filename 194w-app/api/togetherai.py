from together import Together # pip install together
import dotenv # pip install python-dotenv
import os


dotenv.load_dotenv()
Together.api_key = os.getenv("TOGETHER_API_KEY")


client = Together()

model_list = client.models.list()
print(f"{len(model_list)} models available.")


## preview
# response = client.chat.completions.create(
#     model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
#     messages=[{"role": "user", "content": "What are some fun things to do in New York?"}],
# )
# print(response.choices[0].message.content)