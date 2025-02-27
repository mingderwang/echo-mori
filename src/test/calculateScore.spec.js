import test from 'ava';
import process from 'process'
import { calculateScore, getPhoneticCharacters, LangType } from '../client/calculateScore.js'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// test this need to launch mecab service
test('getPhoneticCharacter', async t => {
    t.is(await getPhoneticCharacters("今は、何時ですか。", LangType.ja), "イマワナンジデスカ")
    t.is(await getPhoneticCharacters("逃げるは恥だが役に立つ", LangType.ja), "ニゲルハハジダガヤクニタツ")
    t.is(await getPhoneticCharacters("How are you?"), "How are you?")
});

test('calculateScore', async t => {
    t.is(await calculateScore("今は、何時ですか。", "いまはなんじですか", LangType.ja), 100)
    t.is(await calculateScore("逃げるは恥だが役に立つ", "ニゲルハハジダガヤクニタツ", LangType.ja), 100)
    t.is(await calculateScore("How are you?", "How old are you?"), 75)
});