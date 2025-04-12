
# ウェブ上で動くシンセサイザー
## 概要
- シンプルな減算合成方式のシンセサイザー
- プリセットをDBに保存して、読み込めるようにする

## 参考  
* [What is subtractive synthesis? Native Instruments](https://blog.native-instruments.com/subtractive-synthesis/)  
* [減算合成の仕組み Apple](https://support.apple.com/ja-jp/guide/logicpro/lgsife41a22f/11.1/mac/14.6) ←とりあえずこの通りに実装してみたい
* [WebAudio API reference](https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API/Using_Web_Audio_API)
* [周波数とMIDIノートの対応表](https://www.asahi-net.or.jp/~hb9t-ktd/music/Japan/Research/DTM/freq_map.html)　国際式を採用 C4 = 60

## 進捗
- Synth
    - Voicing
        - [x] Monophonic(同時発音数１)
        - [ ] Polyphonic(できたらやりたい)
    - Oscillator
        - [x] 波形選択
        - [ ] オクターブ切り替え
        - [ ] ファインチューン
        - [x] 複数オシレーターの実装

    - 音加工  
        - フィルターセクション  
            - [x] ローパスフィルター(できればハイパスフィルターも)
            - [x] カットオフ周波数の制御  
            - [x] (レゾナンス) 
    - 音量制御  
        - エンベロープ  
            - [x] ADSRでの音量制御  
        - [ ] マスターボリューム  
    - モジュレーション  
        - [ ] フィルターエンベロープ(フィルターのカットオフ周波数の時間変化を制御するADSRエンベロープ)  
        - LFO  
            - [x] 波形選択(Triangle, Square, Sine)  
            - [x] 周波数  
            - [ ] 適用先(オシレーターのピッチ、フィルターカットオフ周波数)  
    - 入出力  
        - 入力  
            - [ ] キーボード入力  
            - [ ] MIDI入力
            - [ ] マウスカーソルの移動で音程とモジュレーションを制御できるパッド  
        - オーディオ出力  
            - [ ] 最終的にはステレオ出力したい。  
- UI

- バックエンド
    
## 機能
1. 音源部
   - オシレーター  
        - 波形選択(Sine, Square, Sawtooth, Triangle)  
        - オクターブ切り替え  
        - ファインチューン(細かい音程調節)  
        
3. 音加工  
    - フィルターセクション  
        - ローパスフィルター(できればハイパスフィルターも)
        - カットオフ周波数の制御  
        - (レゾナンス) ->　理解度浅いのでできれば実装する程度  
4. 音量制御  
    - エンベロープ  
        - ADSRでの音量制御  
    - マスターボリューム  
5. モジュレーション  
    - フィルターエンベロープ(フィルターのカットオフ周波数の時間変化を制御するADSRエンベロープ)  
    - LFO  
        - 波形選択(Triangle, Square, Sine)  
        - 周期の調整  
        - 適用先(オシレーターのピッチ、フィルターカットオフ周波数)  
6. 入出力  
    - 入力  
        - キーボード入力  
        - MIDI入力  
    - オーディオ出力  
        - 最終的にはステレオ出力したい。  


UIについて  
・オシレーターセクション  
・フィルターセクション  
・エンベロープセクション  
・モジュレーションセクション  

スライダーやノブなどで直感的に操作できるようにしたい  

## 実装について  
- フロントエンド  
  - React + TypeScript + MUI + Zustand  (学習コスト低そうな組み合わせ、型指定あったほうが嬉しい)
  - 音声処理はWeb Audio APIを使用  ->　カスタムフック作ってロジックとUI分離
  - UIデザインわからなすぎるーー
- バックエンド  
  - PythonかC#かjavascript
  
- とりあえずフロントエンドを作る。簡単な減算合成方式のシンセサイザー  

