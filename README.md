
# ウェブ上で動くシンセサイザー

<img width="1440" alt="スクリーンショット 2025-04-16 4 31 56" src="https://github.com/user-attachments/assets/5c66fd54-a91b-476f-ae5d-6f2caaf38e58" />

https://github.com/user-attachments/assets/a540737a-46e4-423d-a93f-a959210abc61

## 使い方(ローカル環境)
リポジトリのクローン
```
git clone https://github.com/yumonjiro/websynth.git
```
1. ASP.NET APIサーバーの起動
```
# /websynth/backendに移動
cd backend
dotnet run
```
2. フロントエンドのホスティング
```
# /websynth/frontendに移動
cd frontend
npm install
npm run
```

## 概要
- シンプルな減算合成方式のシンセサイザー
- プリセットをDBに保存して、読み込める


## 進捗
- Synth
    - Voicing
        - [x] Monophonic(同時発音数１)
        - [x] Polyphonic(できたらやりたい)
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
            - [x] ADSRエンベロープでの音量制御  
        - [x] マスターボリューム  
    - モジュレーション  
        - [ ] フィルターエンベロープ(フィルターのカットオフ周波数の時間変化を制御するADSRエンベロープ)  
        - LFO  
            - [x] 波形選択(Triangle, Square, Sine)  
            - [x] 周波数  
            - [x] 適用先(オシレーターのピッチ、フィルターカットオフ周波数)  
    - 入出力  
        - 入力  
            - [x] キーボード入力  
            - [ ] MIDI入力
            - [ ] モノフォニックの場合に、マウスカーソルの移動で音程とモジュレーションを制御できるパッドを追加したい
        - オーディオ出力  
            - [ ] 最終的にはステレオ出力したい。  

- バックエンド
    - [x] プリセットの取得
    - [x] プリセットの保存
    - [ ] プリセットの変更(リネーム)
    - [x] プリセットの削除
    - [x] インメモリデータベースでの実装
    - [x] sqlデータベースでの実装
    - [ ] データベースファイルの作成
    - [ ] OpenAPI Generatorでのフロントエンドとのスキーマすり合わせ
- その他
    - [ ] プリセットを増やす


## 実装
- フロントエンド  
  - React + TypeScript + MUI + Zustand  (学習コスト低そうな組み合わせ、型指定あったほうが嬉しい)
  - 音声処理はWeb Audio APIを使用
  - ピアノの鍵盤のUI　https://github.com/kevinsqi/react-piano.git
  - ノートごとにオシレーターを生成し管理するため、[nanoid](https://github.com/ai/nanoid)を使用
- バックエンド  
  - ASP.NET + EntityFramework + (SwaggerUI)
- その他
  - スキーマのすり合わせは、最終的にOpen API Generatorを使ってみたい。
 
## 参考  
* [What is subtractive synthesis? Native Instruments](https://blog.native-instruments.com/subtractive-synthesis/)  
* [減算合成の仕組み Apple](https://support.apple.com/ja-jp/guide/logicpro/lgsife41a22f/11.1/mac/14.6) 
* [WebAudio API reference](https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API/Using_Web_Audio_API)
* [周波数とMIDIノートの対応表](https://www.asahi-net.or.jp/~hb9t-ktd/music/Japan/Research/DTM/freq_map.html)　国際式を採用 C4 = 60
