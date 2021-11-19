# 크롤러 웹페이지

SKKU-Crawler (가제)를 조작할 수 있는 웹페이지를 제작하고 있습니다.

## ● Application Link

[Heroku](https://dashboard.heroku.com)를 이용해 애플리케이션의 디자인을 확인할 수 있도록 조치했습니다.

- https://dev-skku-crawler.herokuapp.com/

API 서버없이 모든 기능을 이용할 수 없습니다. 아래의 [API 서버 구동](#4-api-서버-구동-api-server-run)을 수행하면 현재 개발된 기능을 모두 이용할 수 있습니다.
## ● 화면예시 Screen Example

### 1. 첫 화면 First Page

![run](https://user-images.githubusercontent.com/41911523/132950496-64444391-cbab-4570-81a3-16a7f1f9ab90.PNG)


### 2. 크롤러 생성 Create Crawlers
1. 미디어를 선택합니다. 현재 News, Reddit, Webtoon 선택 시 체크리스트가 나타나며 선택해야 합니다. 

![media](https://user-images.githubusercontent.com/41911523/132950501-19a11c02-9b53-4cf7-aec8-15f22423bcf0.PNG)

2. 키워드를 입력하고 + 버튼을 눌러서 키워드를 추가합니다. 키워드를 여러개 입력할 수 있습니다.

![input keyword](https://user-images.githubusercontent.com/41911523/132950504-35c3109c-ea4c-4ac4-8984-d22876c2a7d6.PNG)

3. 날짜를 지정합니다.

![select date](https://user-images.githubusercontent.com/41911523/132950545-ec70f2a2-d748-44d8-8d6c-8b29e8a1be75.PNG)

4. +Add Crawler버튼을 눌러 크롤러를 생성합니다. 

![make crawler](https://user-images.githubusercontent.com/41911523/132950551-58fabb0e-01c5-49b0-83c7-8011bf768916.PNG)

### 3. Task 생성 Create Task
1. Task 이름을 입력합니다.

![make task1](https://user-images.githubusercontent.com/41911523/132950715-e6a3edd9-a2e5-4454-b79b-c7370d005e81.PNG)

2. +Create 버튼을 눌러 Task를 생성합니다. 생성한 크롤러 여러 개를 묶어 하나의 Task로 만드는 것입니다. 

![make task2](https://user-images.githubusercontent.com/41911523/132950717-4ae25776-06ac-40ca-a379-c4515fa19ccc.PNG)

3. 카드를 누르고 있으면 카드가 뒤집히며 Task 정보를 볼 수 있습니다. 현재 버그가 있어 수정이 필요합니다. 카드 뒷면에 모든 크롤러가 표시되도록 개선해야 합니다.

![card back](https://user-images.githubusercontent.com/41911523/132950721-7fecc7cd-3d8e-4d74-9f5c-314e88ddeff4.PNG)

4. 실행버튼을 누르면 Run 섹터로 카드가 이동합니다. 실제로 크롤러가 동작하지는 않습니다. 프로그레스 바도 동작하지 않습니다.

![run task](https://user-images.githubusercontent.com/41911523/132950729-9fb547b4-51c5-4dd2-a08e-3811a5255ba3.PNG)

5. 정지 버튼을 누르면 Pause 섹터로 카드가 이동합니다. 실제로 크롤러가 동작하지는 않습니다. 프로그레스 바도 동작하지 않습니다.

![pause](https://user-images.githubusercontent.com/41911523/132950731-bdb7eac8-8e52-4862-93b2-197ecdf03d28.PNG)

### 4. 기타 기능
1. 잘못된 입력이면 버튼의 색이 빨갛게 변합니다. 올바른 값을 입력해 다시 누르면 원래대로 돌아옵니다.

![wrong](https://user-images.githubusercontent.com/41911523/132951221-9f512477-b6eb-41b0-9c43-12b694147dd0.PNG)

2. API 서버에 이미 Task가 존재하는 경우 다운로드 버튼을 눌러 Task를 바로 추가할 수 있습니다.

![download](https://user-images.githubusercontent.com/41911523/132951278-d5e8da06-daed-4732-89aa-ac2ee6283411.PNG)

## ● 로컬 설치방법 Local Installation

### 1. 저장소 복제 Clone the repository

```cmd
git clone git@github.com:tsfo1489/ArsPraxiaWebCrawler.git
cd ArsPraxiaWebCrawler/React/crawl/

```

### 2. 외부모듈 설치 Install dependencies

```cmd
npm install 
```

### 3. 리액트 실행 React Run

```cmd
npm start
```

http://localhost:3000 이 출력되면 성공입니다! 프론트엔드 부분만 실행할 수 있습니다.
일부 기능만 실행할 수 있는 상태입니다. 크롤러 관련 기능을 위해서는 API서버가 필요합니다. 

### 4. API 서버 구동 API Server Run
Control 폴더로 이동합니다.
```cmd
cd ../../Control
```

필요한 파이썬 패키지를 설치합니다.
```cmd
pip install flask
pip install flask-restful
pip install requests
```

서버를 구동합니다.
```cmd
python server.py
```
API 서버를 구동하면 로컬에서 실행한 웹이든, Heroku에서 실행한 웹이든지 간에 자유롭게 이용할 수 있습니다.
