Project Open Source untuk Kelas Next.js Batch 64 [Sanbercode](https://sanbercode.com/)

## Persiapan 🚀

<ul>
<li>
  Silahkan clone repo, selanjutnya jangan lupa buat repo di masing2 akun github untuk project ini
</li>
<li>
  Kemudian jalankan perintah <code>npm install</code> or <code>yarn install</code> untuk melakukan instalasi dependencies yang diperlukan, tunggu sampai instalasi selesai
</li>
<li>Setelah itu silahkan jalankan perintah berikut:</li>
</ul>

```bash
npm run dev
# or
yarn dev
```

## Petunjuk Pengerjaan 📎

<ul>
<li>
  Pengerjaan project menggunakan Next.js <code>Pages Router</code> + <code>Typescript</code>
</li>
<li>
  Flow dalam pengumpulan hasil pengerjaannya adalah cukup mengumpulkan link repository, submit linknya melalui menu quiz di dashboard masing2
</li>
<li>
  <code>NOTES:</code>project ini adalah Mini project dan akan di submit sebagai quiz pekan 3, hasil dari pengerjaan akan dipakai juga mendongkrak nilai dari <code>Final Project</code> yang masih kurang
</li>
<li>
  Ada hadiah menarik bagi teman2 yang berhasil mengerjakan Mini project dengan 3 nilai teratas:
  <ol type="1">
    <li>🥇 GOPAY <code>150K</code> ✨</li>
    <li>🥈 GOPAY <code>100K</code> ✨</li>
    <li>🥉 GOPAY <code>50K</code> ✨</li>
  </ol>
</li>
</ul>

## Fitur yang akan dikerjakan 💻

- Referensi tampilan Web ➡️ <a href="https://sanber-daily.vercel.app" target="_blank">Visit Here</a>
- Referensi penggunaan `Middleware` di Next.js ➡️ <a href="https://github.com/pace11/sanber-daily-test" target="_blank">Repo Here</a>
- List Features 🔥

<table>
  <thead>
    <tr>
      <th>Module</th>
      <th>Feature</th>
      <th>Description</th>
      <th>Point</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <!-- Authentication -->
    <tr>
      <td rowspan="4">Authentication</td>
      <td>Register</td>
      <td>
      <ol>
      <li>Buat routing di <code>/register</code></li>
      <li>Sesuaikan form register mengikuti payload yang tersedia di endpoint <code>/api/register</code></li>
      </ol>
      </td>
      <td>5</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <tr>
      <td>Login</td>
      <td>
      <ol>
      <li>Buat routing di <code>/login</code></li>
      <li>Token yang berhasil di generate after login, disimpan ke cookies</li>
      <li>Implementasi <code>middleware</code>, apabila ada token dan valid, user bisa mengakses routing index <code>/</code></li>
      <li>Apabila sebaliknya, user hanya bisa mengakses routing <code>/</code> & <code>/register</code></li>
      </ol>
      </td>
      <td>5</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <tr>
      <td>Logout</td>
      <td>
      <ol>
      <li>Cukup create function untuk logout, proses logout dapat menggunakan endpoint <code>POST /logout</code></li>
      <li>Apabila response dari endpointnya success, jangan lupa remove cookiesnya di browser</li>
      </ol>
      </td>
      <td>8</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <tr>
      <td>Get Profile</td>
      <td>
      <ol>
      <li>Buat routing di <code>/profile</code></li>
      <li>Untuk mendapatkan data user, bisa menggunakan endpoint <code>GET /me</code></li>
      </ol>
      </td>
      <td>5</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <!-- Posts -->
    <tr>
      <td rowspan="4">Posts</td>
      <td>Display All Posts</td>
      <td>
      <ol>
      <li>Semua Posts bisa ditampilkan di routing <code>/</code></li>
      <li>Untuk menampilkan semua Posts cukup mainkan query paramnya <code>GET /api/posts?type=all</code></li>
      </ol>
      </td>
      <td>6</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <tr>
      <td>Display Self Posts</td>
      <td>
      <ol>
      <li>Untuk Posts milik sendiri <code>GET /api/posts?type=me</code></li>
      </ol>
      </td>
      <td>6</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <tr>
      <td>Updating Self Posts</td>
      <td>
      <ol>
      <li>Untuk update Posts milik sendiri <code>PATCH /api/post/update/:post_id</code></li>
      </ol>
      </td>
      <td>8</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <tr>
      <td>Deleting Self Posts</td>
      <td>
      <ol>
      <li>Untuk delete Posts milik sendiri <code>DELETE /api/post/delete/:post_id</code></li>
      </ol>
      </td>
      <td>6</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <!-- Reply -->
    <tr>
      <td rowspan="4">Reply</td>
      <td>Display Replies Count</td>
      <td>
      <ol>
      <li>Response dari endpoint ini <code>GET /api/posts</code> terdapat field yang menampilkan jumlah replies</li>
      </ol>
      </td>
      <td>6</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <tr>
      <td>Display List Reply by Post</td>
      <td>
      <ol>
      <li>Bisa menggunakan endpoint <code>GET /api/replies/post/:post_id</code></li>
      </ol>
      </td>
      <td>6</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <tr>
      <td>Reply by Post</td>
      <td>
      <ol>
      <li>Bisa menggunakan endpoint <code>POST /api/replies/post/:post_id</code></li>
      </ol>
      </td>
      <td>8</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <tr>
      <td>Deleting self Reply</td>
      <td>
      <ol>
      <li>Untuk menghapus reply milik sendiri <code>DELETE /api/replies/delete/:reply_id</code></li>
      </ol>
      </td>
      <td>6</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <!-- Like -->
    <tr>
      <td rowspan="3">Like</td>
      <td>Display Likes Count</td>
      <td>
      <ol>
      <li>Response dari endpoint ini <code>GET /api/posts</code> terdapat field yang menampilkan jumlah likes</li>
      </ol>
      </td>
      <td>6</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <tr>
      <td>Likes Post</td>
      <td>
      <ol>
      <li>Bisa menggunakan endpoint <code>POST /api/likes/post/:post_id</code></li>
      </ol>
      </td>
      <td>7</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <tr>
      <td>Unlikes Post</td>
      <td>
      <ol>
      <li>Bisa menggunakan endpoint <code>POST /api/unlikes/post/:post_id</code></li>
      </ol>
      </td>
      <td>7</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
    <!-- Notification -->
    <tr>
      <td>Notification</td>
      <td>Display List Notifications</td>
      <td>
      <ol>
      <li>Buat routing di <code>/notification</code> </li>
      <li>Bisa menggunakan endpoint <code>GET /api/notifications</code></li>
      </ol>
      </td>
      <td>6</td>
      <td>
        <input type="checkbox" />
      </td>
    </tr>
  </tbody>
</table>

## Docs Service API 📖

- Docs Swagger untuk API ➡️ <a href="https://drive.google.com/file/d/1q_A2t1dG2a9lV8McPCnMrXqfg9cWKuQ5/view?usp=sharing" target="_blank">Download Collection Postman</a>

## Cara Pengerjaan dan Pengumpulan 📭

- Setelah project ini beres, silahkan buat repository baru dengan nama `mini-project-nextjs-batch-64` kemudian push ke repo tersebut
- Kemudian silahkan kumpulkan link repositorynya ke Dashboard LMS masing2 melalui menu `Tugas & Quiz`
  ![Step 1](/public/step-1.png 'Step 1')
- Scroll ke paling bawah dan submit melalui link pengumpulan `Mini Project`
  ![Step 2](/public/step-2.png 'Step 2')
- Semangat teman2 semoga mendapatkan hasil terbaik 🚀
