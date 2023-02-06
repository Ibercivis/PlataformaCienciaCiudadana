import axios from "axios";

import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'http://fran.ibercivis.es:10000/api';

const citmapApi = axios.create({baseURL});


//esto añadirá el token siempre en el encabezado a mis peticiones siempre y cuando el token exista
citmapApi.interceptors.request.use(
    
    async (config) => {
        // console.log('entra en interceptors')
        const token = await AsyncStorage.getItem('token');
        if(token){
            // console.log('MUESTREO DEL TOKEN: ', token)
            // token = 'Token '+token;
            // config.headers!['Key'] = token;
            // config.headers!['Authorization'] = token;
            // console.log('pasa el header '+ token)
        }

        return config;
    } 

)

// citmapApi.interceptors.response.use(
    
//     async (response) => {
//         console.log(response)
        

//         return response;
//     } 

// )

export default citmapApi;