// stable
import CryptoJS from "crypto-js";
import _ from "lodash";

export const normalizeAge = ageRange => {
  if (ageRange.min) {
    if (ageRange.max) {
      return (ageRange.min + ageRange.max) / 2;
    }
    return ageRange.min;
  }
  return ageRange.max;
};

export const encryptText = (text, key) => {
  const ciphetText = CryptoJS.AES.encrypt(text, key);
  return ciphetText.toString();
};

export const decryptText = (cipherText = "", key) => {
  const bytes = CryptoJS.AES.decrypt(cipherText.toString(), key);
  return bytes.toString(CryptoJS.enc.Utf8);
};
export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
};

export const deg2rad = deg => {
  return deg * (Math.PI / 180);
};

export const mileToKm = valueInMile =>
  parseInt(Math.ceil(valueInMile * 1.60934), 10);

export const getOrderedPictures = (
  pictures = [],
  orderedPictures = [],
  profilePictureUrl = ""
) => {
  const newPictures = [];
  orderedPictures = orderedPictures || [];
  pictures = pictures || [];

  orderedPictures.forEach(element => {
    const isExist = _.find(pictures, pic => pic.id === element);
    if (isExist) {
      newPictures.push(isExist);
    }
  });
  pictures.forEach(element => {
    if (!_.some(newPictures, pic => pic.id === element.id)) {
      newPictures.push(element);
    }
  });
  // Handle the profile picture
  if (!newPictures.length) {
    return [{ id: "1", url: profilePictureUrl }].concat(newPictures);
  }
  return newPictures;
};
