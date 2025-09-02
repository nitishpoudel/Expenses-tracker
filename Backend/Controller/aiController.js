import dotenv from 'dotenv';

dotenv.config();

export const generateAIResponse = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        // Get API key from environment variables
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: "AI service not configured"
            });
        }

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }],
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`AI API call failed with status: ${response.status}`);
        }

        const result = await response.json();
        const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

        return res.status(200).json({
            success: true,
            response: aiResponse
        });

    } catch (error) {
        console.error('Error in AI generation:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate AI response",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
