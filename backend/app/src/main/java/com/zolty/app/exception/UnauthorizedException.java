package com.zolty.app.exception;

public class UnauthorizedException  extends RuntimeException {
    public UnauthorizedException (String message) {
        super(message);
    }
}