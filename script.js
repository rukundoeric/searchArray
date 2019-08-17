const getData = async () => {
  let responce = await fetch(
    "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json"
  );
  let data = await responce.json();
  return data;
};

const input = document.getElementById("searchField");
const output = document.getElementById("OutputContainer");
const outputContainer = document.getElementById("searchOutput");
const outputinfo = document.getElementById("cityInfodiv");
const escapeRegexCharacters = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const getCities = (cities, value) => {
  const escapedValue = escapeRegexCharacters(value.trim());
  if (escapedValue === "") {
    return [];
  }
  const regex = new RegExp("^" + escapedValue, "i");
  const out = cities.filter(city => regex.test(city.city || city.state));
  return out;
};
const displayCityInfo = cityDataInfo => {
  const city = document.getElementById("cityInfo");
  const growth = document.getElementById("growthInfo");
  const latitude = document.getElementById("latitudeInfo");
  const longitude = document.getElementById("longitudeInfo");
  const population = document.getElementById("populationInfo");
  const rank = document.getElementById("rankInfo");
  const state = document.getElementById("stateInfo");
  city.innerHTML = "";
  growth.innerHTML = "";
  latitude.innerHTML = "";
  longitude.innerHTML = "";
  population.innerHTML = "";
  rank.innerHTML = "";
  state.innerHTML = "";

  city.innerHTML = cityDataInfo.city;
  growth.innerHTML = cityDataInfo.growth_from_2000_to_2013;
  latitude.innerHTML = cityDataInfo.latitude;
  longitude.innerHTML = cityDataInfo.longitude;
  population.innerHTML = cityDataInfo.population;
  rank.innerHTML = cityDataInfo.rank;
  state.innerHTML = cityDataInfo.state;
  const x = parseFloat(cityDataInfo.growth_from_2000_to_2013);
  if (Number(x) < 50) {
    growth.classList.add("red");
  } else {
    growth.classList.add("green");
  }
};
const switchDivs = isInfo => {
  if (isInfo) {
    outputContainer.classList.add("hide");
    outputinfo.classList.remove("hide");
  } else {
    outputContainer.classList.remove("hide");
    outputinfo.classList.add("hide");
  }
};
const itemClicked = e => {
  switchDivs(true);
  let out = {};
  const city = e.getElementsByTagName("td")[0].innerHTML;
  const state = e.getElementsByTagName("td")[1].innerHTML;
  getData().then(data => {
    out = data.find(item => item.city === city && item.state === state);
    displayCityInfo(out);
  });
};
const appendItems = item => {
  const city = document.createTextNode(item.city);
  const growth = document.createTextNode(item.growth_from_2000_to_2013);
  const population = document.createTextNode(item.population);
  const state = document.createTextNode(item.state);

  const tr = document.createElement("tr");
  tr.classList.add("tr");
  tr.classList.add("trhover");
  tr.setAttribute("id", "dataitem");
  tr.setAttribute("key", item.city);
  tr.setAttribute("onclick", "itemClicked(this)");
  const tdCity = document.createElement("td");
  tdCity.appendChild(city);
  tr.appendChild(tdCity);
  const tdState = document.createElement("td");
  tdState.appendChild(state);
  tr.appendChild(tdState);
  const tdPopulation = document.createElement("td");
  tdPopulation.appendChild(population);
  tr.appendChild(tdPopulation);
  const tdGrowth = document.createElement("td");
  const x = parseFloat(item.growth_from_2000_to_2013);
  if (Number(x) < 50) {
    tdGrowth.classList.add("red");
  } else {
    tdGrowth.classList.add("green");
  }
  tdGrowth.appendChild(growth);
  tr.appendChild(tdGrowth);
  output.appendChild(tr);
};
input.addEventListener("keyup", e => {
  const currentValue = e.target.value;
  if(!currentValue.length < 1){
    if (isNaN(currentValue)) {
      switchDivs(false);
      output.innerHTML = "";
      getData().then(data => {
        const queryCities = getCities(data, currentValue);
        queryCities.forEach(city => {
          appendItems(city);
        });
      });
    } else {
      alert("Invalid input");
    }
  } else {
    alert("You have to search by either the city or state");
  }
});
