import random


def getRandomSalt(length):
    """
    Generate a random salt at length characters.

    param: length (int) - How long the salt should be
    """
    r = random.SystemRandom()
    chars = 'abcdefghijklmnopqrstuvwxyzABCEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()/|?><[]{}_+=-.,'
    salt = ''
    for x in range(length):
        salt += r.choice(chars)

    return salt

