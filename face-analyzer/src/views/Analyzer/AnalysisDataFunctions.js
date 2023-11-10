let firstRun = true;
export const saveDataToLocalStorage = (data) => {
    let retrieved = localStorage.getItem("analysisData");
    let stored;
    if(retrieved && !firstRun){
        stored = JSON.parse(retrieved);
    }
    else{
        localStorage.removeItem("analysisData");
        firstRun = false;
        stored = [];
    }

    stored.push(data);
    localStorage.setItem("analysisData", JSON.stringify(stored));
};

export const getDataFromLocalStorage = () => {

};
