Modulos instalados y mini guía:

    - @react-navigation/native
    - react-native-screens react-native-safe-area-context
        -- Requerimientos Android:
            añadir el codigo en el body de android/app/src/main/java/'package name'/MainActivity.java

            import android.os.Bundle;

            @Override
            protected void onCreate(Bundle savedInstanceState) {
                super.onCreate(null);
            }
        -- Requerimentos IOS;
            npx pod-install ios

    - @react-navigation/stack
    - react-native-gesture-handler
        -- Requerimientos:
            Añadir la siguiente linea en el top del fichero index.js o App.tsx
                import 'react-native-gesture-handler';

    - @react-native-masked-view/masked-view
    - @react-navigation/drawer
    - react-native-gesture-handler react-native-reanimated
        -- Requerimientos:
            En el babel.config.js añadir:
             plugins:[
                'react-native-reanimated/plugin',
             ],
            
            IMPORTANTE npm start -- --reset-cache 
    
    - --save react-native-permissions
     -- Instrucciones IOS/android:
        https://www.npmjs.com/package/react-native-permissions

    - --save react-native-vector-icons
        -- Requerimientos Android:
            En android/app/src/build.grandle pegar:

            project.ext.vectoricons = [
                iconFontNames: [ 'Ionicons.ttf' ] // nombre de las fuentes
            ]

            apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

        -- Requerimientos IOS:
            https://github.com/oblador/react-native-vector-icons
            Se requiere xCode

    - react-native-maps
        -- Guía API-KEY e instalaciones https://github.com/react-native-maps/react-native-maps
        -- Requerimientos Android:
            <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="(codigo de proporcionado por google)"/>
    - @react-native-community/geolocation --save
        -- Requerimentos Android:
         Añadir en el manifest la siguiente linea con el permisio <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
        -- Requerimentos IOS:
            Necesitas incluir NSLocationWhenInUseUsageDescription y NSLocationAlwaysAndWhenInUseUsageDescription en Info.plist para habilitar la
            geolocalización cuando corres la app. Si la app soporta iOS 10 y versiones anteriores, la NSLocationAlwaysUsageDescription key es requerida.

    - Si se desea añadir un carousel: https://github.com/meliorence/react-native-snap-carousel
    - Si se desean añadir tabs/drawer https://reactnavigation.org/docs/bottom-tab-navigator/#props

    - mapbox 
        -- https://github.com/rnmapbox/maps#readme
    - react-native-paper@5.0.0-rc.10 diseños
    - react-native link react-native-image-picker
        -- camara
    
    - -D react-native-flipper

- npm install react-native-responsive-fontsize --save 
    - https://github.com/heyman333/react-native-responsive-fontSize para los tamaños del texto

https://ibjects.medium.com/google-signin-tutorial-for-react-native-81a57fb67b18 WEB QUE EXPLICA SIGN IN ANDROID/IOS
- npm i @react-native-google-signin/google-signin
LOGIN ANDROID: 

    keystore - 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
    android ID cliente 0Auth: 235777853257-k7u75rffibndst0j0s3h7cadpp2k5bd5.apps.googleusercontent.com
    webClient ID 0Auth: 235777853257-rnbdsrqchtl76jq0givh1h6l7u47rs4k.apps.googleusercontent.com
        - secret: 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

- npm install react-native-multi-selectbox

INSTRUCCIONES PARA ARRANCAR LA APP 
- npm i
- Instalar android studio (xcode para correr en ios) y configurar dispositivos en API 30
- npx react-native run-android/ios (uno de los dos)

INSTRUCCIONES CREAR APP DEBUG
- if you have index.android.js in project root then run
    react-native bundle --dev false --platform android --entry-file index.android.js --bundle-output ./android/app/build/intermediates/assets/debug/index.android.bundle --assets-dest ./android/app/build/intermediates/res/merged/debug

- if you have index.js in project root then run
    react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

- cd android/
    .\gradlew assembleDebug
- Then You can find your apk here:
    cd app/build/outputs/apk/

- npm install --save react-native-snap-carousel
    -- npm install --save @types/react-native-snap-carousel

- react native splash screen 
    -- https://github.com/crazycodeboy/react-native-splash-screen
    -- android: INSTALLED
    -- ios: NOT INSTALLED
     
- stepper installed
- mui npm install @mui/material @emotion/react @emotion/styled

- IMPORTANTE IOS. Instalar npm install --save react-native-permissions y seguir para añadir permisos