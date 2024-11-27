import React from 'react';
import GenerateChapterComponent from './GenerateChapterComponent';

const GenerateChaptersPage = () => {

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                <GenerateChapterComponent />
            </div>
        </div>
    )
};

export default GenerateChaptersPage