import { HttpException, HttpStatus } from '@nestjs/common';

// Overloaded function to support both old and new signatures for backward compatibility
export default function Exception(statusCode: HttpStatus, messageOrErrors: string | object, errors: any = []): HttpException {
    // If second parameter is a string, use new format
    if (typeof messageOrErrors === 'string') {
        return new HttpException(
            {
                message: messageOrErrors,
                errors,
            },
            statusCode,
        );
    }

    // If second parameter is an object, use old format for backward compatibility
    return new HttpException(
        {
            status: statusCode,
            errors: messageOrErrors,
        },
        statusCode,
    );
}
