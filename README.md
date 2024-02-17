[![Docker Build Push](https://github.com/Dhivakarkd/Redirector/actions/workflows/docker-push.yml/badge.svg)](https://github.com/Dhivakarkd/Redirector/actions/workflows/docker-push.yml)

<p align="center">
<img src = "https://user-images.githubusercontent.com/46301457/225085182-c93f09e6-ca70-4907-9d75-3749af185fd7.png" width ="150px" height="150px"/>
</p>

# 🚀 Redirector

This is a simple URL shortener that allows users to add URLs with same names which will be stored in a SQLite database on the backend. Users can view all the added URLs using the index page and use short links using go/{value-they-provided}.

With this app, you can create unique and memorable shortcuts that will take you directly to your favorite websites, without ever having to researching for bookmarks in your browser.

## 🗐 Pages

<img src = "https://github.com/Dhivakarkd/Redirector/assets/46301457/71b39006-79db-489d-aa51-408855b3155e.png" width ="48%" height="50%" /> <img src = "https://github.com/Dhivakarkd/Redirector/assets/46301457/29f45674-fa2e-4ad5-a587-a51ddd84d466.png" width ="48%" height="50%"/>

<img src = "https://github.com/Dhivakarkd/Redirector/assets/46301457/fb46af04-f15c-484f-a832-b80fd6aadfda.png" width ="48%" height="50%"/> <img src = "https://github.com/Dhivakarkd/Redirector/assets/46301457/ae61f40e-d8b2-420a-8803-69453e85b39e.png" width ="48%" height="50%"/>

## 🛠️ Installation

- Clone the repository: git clone https://github.com/Dhivakarkd/Redirector.git
- Install dependencies: npm install

## 🚀 Usage

- Start the server: npm start
- Navigate to localhost:3000 in your browser to access the homepage
- To view all the URLs, go to localhost:3000/urls
- To use a shortened URL, go to localhost:3000/go/{value-they-provided}

## 🐳 Docker

You can also use the Docker image to deploy the project. Follow these steps:

- Pull the image: docker pull your-username/url-shortener
- Run the container: docker run -p 3000:3000 -d your-username/url-shortener

## 📝 License

This project is licensed under the MIT License.

Feel free to fork and contribute to this project!

## 🫶 Acknowledgements

- [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
- [Awesome README](https://github.com/matiassingers/awesome-readme)
