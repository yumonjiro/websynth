
# ウェブ上で動くシンセサイザー
## 概要
- シンプルな減算合成方式のシンセサイザー
- プリセットをDBに保存して、読み込めるようにする

## 参考  
* [What is subtractive synthesis? Native Instruments](https://blog.native-instruments.com/subtractive-synthesis/)  
* [減算合成の仕組み Apple](https://support.apple.com/ja-jp/guide/logicpro/lgsife41a22f/11.1/mac/14.6) ←とりあえずこの通りに実装してみたい
* [WebAudio API reference](https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API/Using_Web_Audio_API)

## 進捗
- Synth
    - Oscillator
        - [x] 波形選択
        - [] オクターブ切り替え
        - [] ファインチューン
        - [] 複数オシレーターの実装
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
  - React + TypeScript + MUI + Zustand  
  - 音声処理はWeb Audio APIを使用  ->　カスタムフック作ってロジックとUI分離
- バックエンド  
  - 未定  
- とりあえずフロントエンドを作る。簡単な減算合成方式のシンセサイザー  

