export default class DataService {
    getData() {
        return fetch('Data.json')
            .then((res) => res.json())
            .then((d) => d.root);
    }
}
