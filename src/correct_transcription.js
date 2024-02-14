
async def correct_transcription(text):
    global transcription_data
    corrected_text = await ask_language_model(text, "Correct this text")
    transcription_data['original'] = text
    transcription_data['corrected'] = corrected_text
    return transcription_data
