# 🔥 Sigma Web Framework 🔥

## What is it? 🤔
Sigma Web Framework is a **blazingly fast** ⚡ and **super lightweight** 🪶 templating engine for your web projects! Built for devs who want to code like absolute chads 💪 without the bloat of other frameworks.

### Key Features ✨
- 🚀 **Ultra-fast** templating system
- 🧩 **Component-based** architecture with `<sigma>` tags
- 🔄 **Hot-reloading** for instant feedback
- 🎨 **Tailwind CSS** integration
- 💅 **Zero config** setup - just clone and go!
- 🔌 **Expressions** using `$[]` and `![]` syntax
- 🔀 **Conditional rendering** with `issigma`, `elifsigma`, and `elsesigma`

## Installation 📦
```sh
git clone https://github.com/DeveloperKubilay/sigmaWebFramework
cd sigmaWebFramework
npm install
code .
node .
```

## Quick Start Guide 🏃‍♂️

### 1️⃣ Create a template
```html
<sigma template="my-cool-component">
  <div>Hello, $[name]! You're $[age] years old.</div>
</sigma>
```

### 2️⃣ Use it anywhere
```javascript
document.body.innerHTML += window.beta("my-cool-component", {
  name: "Sigma Chad",
  age: 21
});
```

### 3️⃣ Add conditionals for extra sauce 🌶️
```html
<sigma template="profile-card">
  <div class="card">
    <h2>$[username]</h2>
    <issigma data="isVerified">
      <span class="badge">✓ Verified</span>
    <elsesigma>
      <span class="badge">Not Verified</span>
    </elsesigma>
    </issigma>
  </div>
</sigma>
```

## Layout System 🏗️
```html
<!--
const Layout = ../SigmaFramework/Layouts/Layout.html;
-->

<Layout>
  <h1>My Awesome Content</h1>
  <p>This goes in the slot!</p>
</Layout>
```

## Why Sigma? 📈
The important thing is not to follow trends, but to be efficient and get the job done! 💯

---

# 🔥 Sigma Web Framework 🔥 (Türkçe)

## Bu nedir? 🤔
Sigma Web Framework, web projeleriniz için **aşırı hızlı** ⚡ ve **süper hafif** 🪶 bir şablon motorudur! Diğer framework'lerin şişkinliği olmadan, gerçek sigma gibi kod yazmak isteyen geliştiriciler için tasarlandı 💪.

### Ana Özellikler ✨
- 🚀 **Ultra-hızlı** şablonlama sistemi
- 🧩 `<sigma>` etiketleri ile **bileşen-tabanlı** mimari
- 🔄 Anında geri bildirim için **otomatik yenileme**
- 🎨 **Tailwind CSS** entegrasyonu
- 💅 **Sıfır yapılandırma** - sadece klonla ve başla!
- 🔌 `$[]` ve `![]` sözdizimi ile **İfadeler**
- 🔀 `issigma`, `elifsigma` ve `elsesigma` ile **Koşullu render etme**

## Kurulum 📦
```sh
git clone https://github.com/DeveloperKubilay/sigmaWebFramework
cd sigmaWebFramework
npm install
code .
node .
```

## Hızlı Başlangıç Rehberi 🏃‍♂️

### 1️⃣ Bir şablon oluştur
```html
<sigma template="harika-bileşenim">
  <div>Merhaba, $[isim]! Sen $[yas] yaşındasın.</div>
</sigma>
```

### 2️⃣ Her yerde kullan
```javascript
document.body.innerHTML += window.beta("harika-bileşenim", {
  isim: "Sigma Chad",
  yas: 21
});
```

### 3️⃣ Ekstra lezzet için koşullar ekle 🌶️
```html
<sigma template="profil-kartı">
  <div class="card">
    <h2>$[kullaniciadi]</h2>
    <issigma data="dogrulanmis">
      <span class="badge">✓ Doğrulanmış</span>
    <elsesigma>
      <span class="badge">Doğrulanmamış</span>
    </elsesigma>
    </issigma>
  </div>
</sigma>
```

## Düzen Sistemi 🏗️
```html
<!--
const Layout = ../SigmaFramework/Layouts/Layout.html;
-->

<Layout>
  <h1>Müthiş İçeriğim</h1>
  <p>Bu slota gider!</p>
</Layout>
```

## Neden Sigma? 📈
önemli olan trendleri takip etmek değil, verimlilik ve işi bitirmektir! 💯
