import { speed, voice } from './model/config.js'
import { LangType, calculateScore } from './calculateScore.js'
import { say, listen, ListenResultType } from './speechEngine.js'
import { getRubyText } from './rubyText.js'
import { getTokenInfos } from './utils.js'
import { comments } from './model/store.js'
import { get } from 'svelte/store';
import { Voices } from './model/constants.js'

const sentences = [
    "Why do you need to learn English?",
    "Well, why not?",
    "We can hardly imagine life without English. ",
    "I was surprised and upset. ",
    "I tried to hide my ugly pimple, but nothing I did worked.",
    "One morning, the day nurse arrived to bring water for their baths but discovered that John was dead in his sleep.",
    "Sadly, she asked someone to take him away. ",
]

export const playGame = async () => {
    for (let i in sentences) {
        // show left text
        let sentence = sentences[i]
        //var tokenInfos = await getTokenInfos(sentence)
        comments.update(x => [...x, { type: 'teacher', text: sentence }])

        let duration = await say(sentence, get(speed), get(voice))

        // show listening text
        comments.update(x => [...x, { type: 'listening', text: '正在聽你說...' }])


        // plus 400 ms
        let result = await listen(duration + 400)
        var displayText = "default display text"
        var score = 0
        switch (result.type) {
            case ListenResultType.success:
                //tokenInfos = await getTokenInfos(result.text)
                score = await calculateScore(sentence, result.text)
                displayText = result.text
                break;
            case ListenResultType.cannotHear:
                displayText = "聽不清楚，請大聲一點。" // need i18n later
                break;
            case ListenResultType.error:
                displayText = "抱歉，目前出現了一些問題。" // need i18n later
                break;
        }

        // remove listening text and show recognized text with score
        comments.update(x => [...x.slice(0, x.length - 1),
                              { type: 'user', text: displayText, score: score}
                             ]
                       )
        var judgement = ""
        if (score == 100) { judgement = "Excellent" }
        else if ( score >= 80 ) { judgement = "Great" }
        else if ( score >= 60 ) { judgement = "Good"　}
        else { judgement = "Not Right"}
        await say(judgement, 1.0, Voices.enF1 )
    }
}
