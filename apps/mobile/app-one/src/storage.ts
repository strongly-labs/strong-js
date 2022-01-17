import MMKVStorage, { create } from 'react-native-mmkv-storage'
export const storage = new MMKVStorage.Loader().withEncryption().initialize()

export const useStorage = create(storage)
