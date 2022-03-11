const utils = {
    importFile: async (filePath: string): Promise<any> => {
        return (await import(filePath))?.default;
    }
}

export default utils;