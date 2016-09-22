#!/usr/bin/env python
# -*- coding: utf-8 -*-

import argparse
import atexit
import sys
import logging

from gps_auf_raedern import server

USAGE = "usage: python %prog COMMAND [OPTIONS]"
TIMESTAMP = "%Y/%m/%d %H:%M:%S"
logger = logging.getLogger(__name__)


@atexit.register
def on_exit():
    logger.info("on exit call")


def get_args(args=None):
    """
    command line parameter parser

    :param args:
    :return:
    """
    parser = argparse.ArgumentParser(description=USAGE)

    parser.add_argument("-v", "--verbose", action="store_true", default=False,
                        dest="verbose", help="increase verbosity")

    parser.add_argument("--host", dest="host", default="0.0.0.0",
                        help="server host")

    parser.add_argument("--port", dest="port", default=8080, type=int,
                        help="server port")

    args = parser.parse_args(args=args)
    # TODO: args validation
    return args


def main():
    # create parser
    args = get_args()

    # init logger
    console = logging.StreamHandler(sys.stdout)
    console.setFormatter(logging.Formatter("[%(asctime)s]"
                                           "[%(levelname)s]"
                                           " %(message)s",
                                           TIMESTAMP))
    logger.setLevel(logging.INFO)

    logger.addHandler(console)

    if args.verbose:
        console.setFormatter(logging.Formatter("[%(asctime)s]"
                                               "[%(levelname)s]"
                                               "[%(pathname)s]"
                                               "[%(funcName)s]"
                                               "[%(lineno)d]"
                                               " %(message)s",
                                               TIMESTAMP))
        logger.setLevel(logging.DEBUG)

    server.run(args)


if __name__ == "__main__":
    main()
