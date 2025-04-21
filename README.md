# Thanthan App
This is a mobile app made with [Expo](https://expo.dev) and React Native. Using [Supabase](https://supabase.com/) for the backend database. The app is not fully done in it's current state but it is functional and has User Authentication, CRUD functionality and a basic User Interface. Test user login details can be found in the 'test-users.txt' which can used to login and view the contents of the app. A database seed file is also provided in 'lib/seed.ts' and can be used to generate new types of data for further testing.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

3. Run Seed (OPTIONAL)

   ```bash
    npx tsx lib/seed.ts
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).
