import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("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");
export async function getPrediction(dataset, prompt) {
    const datasetString = JSON.stringify(dataset);
    const chatCompletion = await client.chatCompletion({
        provider: "novita",
        model: "meta-llama/Llama-3.2-3B-Instruct",
        messages: [
            {
                role: "user",
                content: `Given the following dataset ${datasetString}, ${prompt}. 
                The explanation should be brief and give me the predicted value only. At the end please specify the 
                output as follows 'Predicted Ambient Tmemperature: predicted value°C`,
            },
        ],
        max_tokens: 500,
    });

    console.log('Message sent to server', chatCompletion.choices[0].message);
    
    return chatCompletion.choices[0].message.content;
}
