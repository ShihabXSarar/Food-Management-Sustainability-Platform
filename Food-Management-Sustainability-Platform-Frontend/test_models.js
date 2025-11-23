const apiKey = "AIzaSyBK99DuFy9JsLaeXs6qHQey06wEnCwGrA0";

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods})`));
        } else {
            console.log("No models found or error:", data);
        }

    } catch (error) {
        console.error("Error fetching models:", error.message);
    }
}

listModels();
