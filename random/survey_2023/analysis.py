#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#  analysis.py
#  
#  Copyright 2023 hward <hward@karauruss-Air.home>
#  
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; either version 2 of the License, or
#  (at your option) any later version.
#  
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#  
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#  
#  Modified in 2026 for the blog to get more info

# How to use venv:
# cd ~
# python -m venv venv
# source venv/bin/activate

import time, sys, math
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime

class Entry:
	def __init__(s, line: str):
		try:
			s.id, s.is_active, s.timestamp = line.split(' ')
		except ValueError:
			s.id, is_active = None, None
			s.timestamp = line.strip()
		s.timestamp = int(s.timestamp)
		s.timestamp_readable = str(datetime.fromtimestamp(s.timestamp))

class Client:
	def __init__(s, entries: list[Entry]):
		s.entries = entries

	def add(s, entry: Entry) -> None:
		s.entries.append(entry)

	def first_entry(s) -> int:
		return min([entry.timestamp for entry in s.entries])

	def tot_time(s) -> int:
		MAX_UPDATE_INTERVAL = 5
		tot_time = 0
		prev_t = s.entries[0].timestamp
		first_segment_t = s.entries[0].timestamp
		for t in [entry.timestamp for entry in s.entries]:
			if t - prev_t > MAX_UPDATE_INTERVAL:# gap between updates
				tot_time += prev_t - first_segment_t
				first_segment_t = t
			prev_t = t
		return tot_time

class Experiment:
	def __init__(s, data: str):
		lines = data.split('\n')
		s.clients = {}# {ID: Client}
		for line in lines:
			if line.strip() != '':
				# create Entries
				entry = Entry(line.strip())
				# add to clients
				if entry.id in s.clients.keys():
					s.clients[entry.id].add(entry)
				else:
					s.clients[entry.id] = Client([entry])

	def basic_stats(s) -> None:
		data = [client.tot_time() for client in s.clients.values()]
		data.sort()
		print(data)
		# Basic stats
		print(f'Mean (s): {sum(data)/len(data)}')
		print(f'Median (s): {data[int(len(data)/2)]}')

	def hist(s) -> None:
		# https://matplotlib.org/stable/gallery/lines_bars_and_markers/scatter_hist.html#sphx-glr-gallery-lines-bars-and-markers-scatter-hist-py
		data = [client.tot_time() for client in s.clients.values()]
		bin_log_base = 2**0.5
		bins = bin_log_base**(np.arange(0, math.ceil(math.log(max(data), bin_log_base))))
		plt.xscale('log')
		plt.hist(data, bins=bins)
		plt.show()


def load_file(name) -> Experiment:
	with open(name) as f:
		raw = f.read()
	return Experiment(raw)

def main():
	# Load
	experiment = load_file(input('Filename: '))
	# Stats
	print(f'Number of clients: {str(len(experiment.clients))}')
	experiment.basic_stats()
	experiment.hist()
	return 0

if __name__ == '__main__':
    import sys
    sys.exit(main())
