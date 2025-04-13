
dotnet add package Microsoft.EntityFrameworkCore.InMemory
    - データベース機能
dotnet add package Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore
    - 何に使うんだこれ




dotnet add package NSwag.AspNetCore  
    - swagger UI表示のため。

ポート番号の指定は、Property/launchsettings.jsonで

### EntityFrameWorkについて

## エンティティとは
データベースの文脈でのクラスみたいな？
→違うっぽい。クラスは共通のプロパティとか属性を持つオブジェクトの集合。テンプレート。  
エンティティは実体。クラスのインスタンスに近い？硬く言えば、属性ではなく、あるidentityによって識別されるもの。 

所有されているエンティティ型っていう概念を理解するためにここの部分の理解が必要。

[What's the difference between entity and class? Stack Overflow](https://stackoverflow.com/questions/2550197/whats-the-difference-between-entity-and-class)

## 所有されているエンティティ型について
このエラーの対処
System.InvalidOperationException: The entity type 'SynthSettings' requires a primary key to be defined. If you intended to use a keyless entity type, call 'HasNoKey' in 'OnModelCreating'. For more information on keyless entity types, see https://go.microsoft.com/fwlink/?linkid=2141943.

SynthSettingsのために新たにテーブルを作成しようとしてるけど、SynthSettings2位はプライマリーキーがない。
→SynthSettingsはPresetの一部だから、SynthSettingsにプライマリキーは必要ない。
→SynthSettingsはidentityによって識別されるものではない。Presetの持つ値の一つに過ぎないので、普通のEntityではなく、所有されるEntity型。

## 所有されているエンティティ型の詳細
Unable to determine the owner for the relationship betweenエラーについて
Unable to determine the owner for the relationship between 'SynthSettings.Oscillators' and 'OscillatorSettings' as both types have been marked as owned.

SynthSettings.OscillatorsとOscillatorSettingsの所有関係が自明じゃない？

複雑になってきたら明示的に所有を指定しよう。
[Owned Entity Types](https://learn.microsoft.com/en-us/ef/core/modeling/owned-entities)

所有されているエンティティ型は、概念としてはidentityを持たないが、実際データベースに格納する際には何らかのidentityが必要。
1. 所有されるエンティティ型が親と１体１に対応している場合
親のIdを所有されるエンティティに割り振れば、エンティティ型のIdが定まる。
2. 所有されるエンティティ型が、１つの親に対して複数ある(コレクションとして定義されている場合)
親のId一つでは、コレクションに含まれる全てのエンティティに対してidを割り振れない。
→明示的に、どうやって割り振るかを指定しないと、データベースに格納できない。
解決例
- 子の識別子として、{親Id,子Id}を使う。例えば、親１の２番目の子エンティティは{1,2}親３の３番目のコンポーネントは{3,3}。これは全ての子に対して一意。
→こういうことをOnModelCreating内で明示的にする必要がある。

##　バックエンドから送ったJSONをどうやってTypeScriptの型にキャストするか？
- data as SynthSettings
    - 手軽だけど、実行時の安全性全くなくて怖いし、APIの変更に弱い

- zod
    - スキーマ検証ライブラリの中では手軽らしい

- 手動でチェックする関数作る
    - めんどくさい
