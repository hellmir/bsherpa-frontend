import axios from 'axios';

function Step1Api() {
  axios
    .post('http://localhost:8080/step1/chapters')
    .then((response) => {
      //  console.log(JSON.stringify(response.data, null, 2));
    })
    .catch((error) => {
      console.log('@error: ' + error);
    })
    .then(() => {
      // 항상 실행
    });
}

export default Step1Api;
