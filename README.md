[![Docker Build Push](https://github.com/Dhivakarkd/Redirector/actions/workflows/docker-push.yml/badge.svg)](https://github.com/Dhivakarkd/Redirector/actions/workflows/docker-push.yml)

<p align="center">
<img src = "https://user-images.githubusercontent.com/46301457/225085182-c93f09e6-ca70-4907-9d75-3749af185fd7.png" width ="150px" height="150px"/>
</p>

# 🚀 Redirector

This is a simple URL shortener that allows users to add URLs with same names which will be stored in a SQLite database on the backend. Users can view all the added URLs using the index page and use short links using go/{value-they-provided}.

With this app, you can create unique and memorable shortcuts that will take you directly to your favorite websites, without ever having to researching for bookmarks in your browser.

## 🗐 Pages

<img src = "https://user-images.githubusercontent.com/46301457/225082006-c0a8d2f2-6a9a-4af1-95cd-af8e47b7ebe3.png" width ="48%" height="50%" /> <img src = "https://user-images.githubusercontent.com/46301457/225081354-8cdd8970-7f30-4ee7-8cc7-d1fc54916188.png" width ="48%" height="50%"/>


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
